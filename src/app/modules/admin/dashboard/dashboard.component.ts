import {Component, OnInit} from '@angular/core';
import {GeneralService} from "../../../_services/data/general.service";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";

declare let L: any;

import {AuthService} from "../../../_services/auth/auth.service";
import {ProfileService} from "../../../_services/data/profile.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  listFiles: any;
  dataMap: any = [];
  markers: any = [];
  map: any;
  branchList = [
    {company: 'Branch A', latLng: [21.0285, 105.8542]},
    {company: 'Branch B', latLng: [10.8231, 106.6297]}
  ];
  agencyList: any = [];
  parentDepartList = [
    {name: 'Region 1', value: 'R1', company: 'Branch A', latLng: [21.0285, 105.8542]},
    {name: 'Region 2', value: 'R2', company: 'Branch A', latLng: [20.4388, 106.1621]},
    {name: 'Region 3', value: 'R3', company: 'Branch B', latLng: [10.8231, 106.6297]},
    {name: 'Region 4', value: 'R4', company: 'Branch B', latLng: [11.0904, 108.0721]},
  ];
  element = {
    company: '',
    parent_depart: '',
    agency_inside: '',
    textSearch: '',
    agency: '',
    jobTitle: ''
  };
  tableParentDepart: any;
  tableAgency: any;
  blueMarker: any;
  focusMarker: any;
  orangeMarker: any;
  whiteMarker: any;
  clickCircle: any;
  personList: any;
  showListQlu = false;
  showListNvkt = false;
  isShowMap: any;

  constructor(private generalService: GeneralService, private spinner: NgxSpinnerService,
              private authService: AuthService, private profileService: ProfileService) {
    this.blueMarker = new L.Icon({
      iconUrl: 'assets/images/map/marker-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [26, 33],
      iconAnchor: [13, 33],
      popupAnchor: [1, -30],
      shadowSize: [43, 33]
    });
    this.orangeMarker = new L.Icon({
      iconUrl: 'assets/images/map/marker-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [26, 33],
      iconAnchor: [13, 33],
      popupAnchor: [1, -30],
      shadowSize: [43, 33]
    });
    this.whiteMarker = new L.Icon({
      iconUrl: 'assets/images/map/marker-white.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [26, 33],
      iconAnchor: [13, 33],
      popupAnchor: [1, -30],
      shadowSize: [43, 33]
    });
    this.focusMarker = new L.Icon({
      iconUrl: 'assets/images/map/marker-focus.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [37, 45],
      iconAnchor: [19, 44],
      popupAnchor: [1, -30],
      shadowSize: [53, 43]
    });
  }

  ngOnInit(): void {
    this.authService.changeEmitted$.subscribe((res) => {
      if (res === 'user_info') {
        this.element.company = JSON.parse(sessionStorage.getItem('userInfo') as string)['branch'];
        this.isShowMap = true;
        this.getDataMap();
      }
    });
  }

  getDataMap() {
    this.profileService.getDataMap().subscribe((res) => {
      if (res && res.statusCode === 1) {
        if (res.data.length > 0) {
          this.dataMap = res.data;
          this.createMap();
          this.receiveSelectEvent(this.branchList.filter(item => item.company === this.element.company)[0], 'branch');
        } else {
          this.isShowMap = false;
        }
      } else {
        this.isShowMap = false;
      }
    }, error => {
      this.isShowMap = false;
    });
  }

  createMap() {
    const mapOptions = {
      center: [14.0583, 108.2772],
      zoomControl: false,
      dragging: false,
      zoom: 8,
      minZoom: 8,
      scrollWheelZoom: false
    };
    this.map = new L.map('map', mapOptions);
    const layer = new L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.map.addLayer(layer);
    this.dataMap.forEach(i => {
      const marker = L.marker([i.lat, i.lng], {icon: this.blueMarker, title: i.agency_inside});
      marker.bindPopup(
        `<div style="background: transparent">
            <div style="background: white; text-align: center; border-radius: 8px; padding: 8px 10px; line-height: 1.5;">
                <div style="display: flex; align-items: center; justify-content: center">
                  Region ${i.company}
                  <i style="font-size: 0.25rem; margin: 0 5px; color: #D9D9D9;" class="fa-solid fa-circle"></i>
                  ${i.parent_depart}
                  <i style="font-size: 0.25rem; margin: 0 5px; color: #D9D9D9;" class="fa-solid fa-circle"></i>
                  ${i.agency_inside}
                </div>
                <div style="color: #8E98A4;">${i.city}</div>
            </div>
            <div style="border-bottom: 1px dashed #c0ccdb; padding: 10px; text-align: center;">Manager: ${i.technical_manager}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 0;">
                <div style="margin-right: 1.2rem;"><div style="text-align: center">${i.numberBlock}</div><div style="color: #778392; text-align: center">Block</div></div>
                <div style="margin-right: 1.2rem;"><div style="text-align: center">${i.numberManager}</div><div style="color: #778392; text-align: center">Manager</div></div>
                <div><div style="text-align: center">${i.numberEmp}</div><div style="color: #778392; text-align: center">Staff</div></div>
            </div>
        </div>`
      );
      marker.addTo(this.map);
      marker.on('mouseover', function (ev) {
        ev.target.openPopup();
      });
      marker.on('mouseout', function (ev) {
        ev.target.closePopup();
      });
      marker.on('click', () => {
        this.receiveSelectEvent(i, 'agency');
      });
      this.markers.push(marker);
    });
  }

  receiveSelectEvent(e: any, str: any) {
    this.showListNvkt = false;
    this.showListQlu = false;
    switch (str) {
      case 'branch':
        this.tableAgency = null;
        this.element.company = e.company;
        this.element.parent_depart = '';
        this.element.agency_inside = '';
        this.element.textSearch = '';
        this.agencyList = this.dataMap.filter(item => item.company === e.company);
        const idList = this.agencyList.map(i => i.agency_inside);
        if (this.clickCircle !== undefined) {
          this.map.removeLayer(this.clickCircle);
        }
        for (const i of this.markers) {
          i.closePopup();
          const markerID = i.options.title;
          if (idList.includes(markerID)) {
            i.setIcon(this.blueMarker);
          } else {
            i.setIcon(this.whiteMarker);
          }
        }
        this.map.flyTo(e.latLng, 7.5);
        break;
      case 'parent_depart':
        this.tableAgency = null;
        this.element.parent_depart = e.name;
        this.element.company = e.company;
        this.element.agency_inside = '';
        this.element.textSearch = '';
        this.agencyList = this.dataMap.filter(item => item.parent_depart === e.name && item.company === e.company);
        const branchList = this.dataMap.filter(item => item.company === e.company).map(i => i.agency_inside);
        const idList1 = this.agencyList.map(i => i.agency_inside);
        if (this.clickCircle !== undefined) {
          this.map.removeLayer(this.clickCircle);
        }
        for (const i of this.markers) {
          i.closePopup();
          const markerID = i.options.title;
          if (idList1.includes(markerID)) {
            i.setIcon(this.orangeMarker);
          } else if (branchList.includes(markerID)) {
            i.setIcon(this.blueMarker);
          } else {
            i.setIcon(this.whiteMarker);
          }
        }
        this.map.flyTo(e.latLng, 8);
        break;
      case 'agency':
        let obj: any = {};
        this.personList = null;
        Object.assign(obj, e);
        this.element.company = obj.company;
        this.element.parent_depart = obj.parent_depart;
        this.element.agency_inside = obj.agency_inside;
        this.tableAgency = obj;
        this.agencyList = this.dataMap.filter(item => item.parent_depart === obj.parent_depart && item.company === obj.company);
        const branchList2 = this.dataMap.filter(item => item.company === obj.company).map(i => i.agency_inside);
        const idList2 = this.agencyList.map(i => i.agency_inside);
        if (this.clickCircle !== undefined) {
          this.map.removeLayer(this.clickCircle);
        }
        for (const i of this.markers) {
          const markerID = i.options.title;
          if (idList2.includes(markerID)) {
            if (obj.agency_inside === markerID) {
              i.setIcon(this.focusMarker);
              this.clickCircle = L.circle([obj.lat, obj.lng], {
                color: '#FFF3F0',
                fillColor: '#f1b2aa',
                fillOpacity: 0.5,
                weight: 2,
                radius: 10000,
              });
              this.clickCircle.addTo(this.map);
              this.map.flyTo([obj.lat, obj.lng], 12);
              i.openPopup();
            } else {
              i.setIcon(this.orangeMarker);
            }
          } else if (branchList2.includes(markerID)) {
            i.setIcon(this.blueMarker);
          } else {
            i.setIcon(this.whiteMarker);
          }
        }
        break;
      case 'close':
        this.tableAgency = null;
        this.personList = null;
        this.element.parent_depart = e.parent_depart;
        this.element.company = e.company;
        this.element.agency_inside = '';
        this.element.textSearch = '';
        let data: any;
        if (this.element.company) {
          data = this.branchList.filter(item => item.company === this.element.company)[0];
          this.agencyList = this.dataMap.filter(item => item.company === data.company);
          const idListC = this.agencyList.map(i => i.agency_inside);
          if (this.clickCircle !== undefined) {
            this.map.removeLayer(this.clickCircle);
          }
          for (const i of this.markers) {
            i.closePopup();
            const markerID = i.options.title;
            if (idListC.includes(markerID)) {
              i.setIcon(this.blueMarker);
            } else {
              i.setIcon(this.whiteMarker);
            }
          }
          this.map.flyTo(data.latLng, 6.5);
        }
        break;
      default:
        break;
    }
  }

  searchPerson() {
    let content: any = {
      email: '',
      name: '',
      empCode: '',
      agencyInside: '',
      jobTitle: ''
    };
    const reg = new RegExp('^\\d+$', 'g');
    if (reg.test(this.element.textSearch.trim().toString())) {
      content.code = this.element.textSearch.trim();
    } else if (this.element.textSearch.trim().includes('@')) {
      content.email = this.element.textSearch.trim();
    } else {
      content.name = this.element.textSearch.trim();
    }
    this.spinner.show();
    this.profileService.getEmpInfoDashboard(content).subscribe((res) => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        if (res.data.length > 0) {
          this.personList = res.data;
        } else {
          this.personList = [];
        }
      } else {
        this.personList = [];
      }
    }, error => {
      this.personList = [];
    });
  }

  eventButton(e: any) {
    if (this.element.textSearch && this.element.textSearch.trim() !== '') {
      if ((e.keyCode === 13 && !e.shiftKey)) {
        this.searchPerson();
      }
    }
  }

  addFile() {
    this.spinner.show();
    const formData = this.generalService.submitData(this.listFiles, false, true);
    this.generalService.importFile(formData).subscribe(res => {
      this.spinner.hide();
      if (res && res.statusCode === 1) {
        Swal.fire('Success', res.message, 'success');
      } else {
        Swal.fire('Notice', res.message, 'warning');
      }
    });
  }

  receiveFile(e) {
    const file = e.target.files[0];
    this.listFiles = [];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt: any) => {
        this.listFiles.push({
          dataURI: reader.result,
          fileType: file.type,
          fileName: file.name.split('.')[0],
        });
      };
    }
  }
}
