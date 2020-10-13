import { Injectable } from '@angular/core';
import { TNSPlayer } from 'nativescript-audio';

@Injectable()
export class SoundService {

  private _player: TNSPlayer;

  constructor() {

  }

  makePlayer() {
    this._player = new TNSPlayer();
  }

  createPlayer(audioPath: string, loop: boolean) {
    var p: TNSPlayer = new TNSPlayer()
    p.initFromFile({
      audioFile: audioPath, // ~ = app directory
      loop: loop,
      // completeCallback: this._trackComplete.bind(this),
      // errorCallback: this._trackError.bind(this)
    })
    return p
  }

  initPlayer(audioPath: string, loop: boolean) {
    return this._player
      .initFromFile({
        audioFile: audioPath, // ~ = app directory
        loop: loop,
        // completeCallback: this._trackComplete.bind(this),
        // errorCallback: this._trackError.bind(this)
      })

  }


  getDurartion(): Promise<any> {
    return this._player.getAudioTrackDuration()
  }


  play(): Promise<any> {
    return this._player.play()
  }

  resume() {
    this._player.resume()
  }

  pause(): Promise<any> {
    return this._player.pause()
  }


  private _trackComplete(args: any) {
    // console.log('reference back to player:', args.player);
    // iOS only: flag indicating if completed succesfully
    // console.log('whether song play completed successfully:', args.flag);
  }

  private _trackError(args: any) {
    // console.log('reference back to player:', args.player);
    // console.log('the error:', args.error);
    // Android only: extra detail on error
    // console.log('extra info on the error:', args.extra);
  }

}
