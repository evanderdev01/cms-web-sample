import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../../../_services/auth/auth.service";
import {GameService} from "../../../../../_services/data/game.service";
import {Howl} from 'howler';
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-lucky-number-detail',
  templateUrl: './lucky-number-detail.component.html',
  styleUrls: ['./lucky-number-detail.component.scss']
})
export class LuckyNumberDetailComponent implements OnInit, OnDestroy {
  randomNumber1 = 0;
  randomNumber2 = 0;
  randomNumber3 = 0;
  randomNumber4 = 0;
  randomNumber5 = 0;
  randomNumber6 = 0;
  refreshIntervalId1: any;
  refreshIntervalId2: any;
  refreshIntervalId3: any;
  refreshIntervalId4: any;
  refreshIntervalId5: any;
  refreshIntervalId6: any;

  prizeList = [
    {id: 1, name: 'Giải Nhất', value: 'giai_nhat'},
    {id: 2, name: 'Giải Nhì', value: 'giai_nhi'},
    {id: 3, name: 'Giải Ba', value: 'giai_ba'},
    {id: 4, name: 'Giải Khuyến Khích', value: 'khuyen_khich'},
  ]

  sub: any;
  prize: any;
  resultGame: any;
  isError: any;
  isPlay: any;
  sound: any;
  soundQuay: any;
  messageError = '';

  constructor(private routeParams: ActivatedRoute, private authService: AuthService, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.routeParams.params.subscribe(params => {
      this.prize = this.prizeList.filter(item => item.id === parseInt(params['id']))[0].value;
    });
    this.soundQuay = new Howl({src: ['assets/sounds/quayso1.mp3'], html5: true});
    this.sound = new Howl({src: ['assets/sounds/congrats.wav'], html5: true});
  }

  getPrize() {
    const content = {
      email: this.authService.getEmailUser(),
      prize: this.prize,
    }
    this.sub = this.gameService.getResultOfQuaySo(content).subscribe((event) => {
      if (event.type === HttpEventType.Sent) {
        this.isPlay = true;
        this.soundQuay.play();
        this.refreshIntervalId1 = setInterval(() => {
          this.randomNumber1 = this.randomFunc(0, 9);
        }, 50);
        this.refreshIntervalId2 = setInterval(() => {
          this.randomNumber2 = this.randomFunc(0, 9);
        }, 50);
        this.refreshIntervalId3 = setInterval(() => {
          this.randomNumber3 = this.randomFunc(0, 9);
        }, 50);
        this.refreshIntervalId4 = setInterval(() => {
          this.randomNumber4 = this.randomFunc(0, 9);
        }, 50);
        this.refreshIntervalId5 = setInterval(() => {
          this.randomNumber5 = this.randomFunc(0, 9);
        }, 50);
        this.refreshIntervalId6 = setInterval(() => {
          this.randomNumber6 = this.randomFunc(0, 9);
        }, 50);
      }
      if (event.type === HttpEventType.Response) {
        let res = event.body;
        if (res && res.statusCode === 1) {
          this.isError = false;
          const a = res.data.result.split('');
          this.setTimeOutNumber(this.refreshIntervalId1, this.randomNumber1, a[0], 5000);
          this.setTimeOutNumber(this.refreshIntervalId2, this.randomNumber2, a[1], 6000);
          this.setTimeOutNumber(this.refreshIntervalId3, this.randomNumber3, a[2], 7000);
          this.setTimeOutNumber(this.refreshIntervalId4, this.randomNumber4, a[3], 8000);
          this.setTimeOutNumber(this.refreshIntervalId5, this.randomNumber5, a[4], 9000);
          this.setTimeOutNumber(this.refreshIntervalId6, this.randomNumber6, a[5], 10000);
          setTimeout(() => {
            this.resultGame = res.data;
            this.soundQuay.stop();
            this.sound.play();
          }, 11000);
        } else {
          this.soundQuay.stop();
          this.clearAllInterval();
          this.isError = true;
          this.messageError = res.message;
        }
      }
    }, error => {
      this.clearAllInterval();
      this.isError = true;
      setTimeout(() => {
        this.soundQuay.stop();
      }, 50);
    });
  }

  clearAllInterval() {
    clearInterval(this.refreshIntervalId1);
    clearInterval(this.refreshIntervalId2);
    clearInterval(this.refreshIntervalId3);
    clearInterval(this.refreshIntervalId4);
    clearInterval(this.refreshIntervalId5);
    clearInterval(this.refreshIntervalId6);
  }

  randomFunc(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  setTimeOutNumber(interval, n1, n2, time) {
    setTimeout(() => {
      clearInterval(interval);
      n1 = n2;
    }, time);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
