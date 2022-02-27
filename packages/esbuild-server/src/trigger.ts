//
// Copyright 2022 DXOS.org
//

export class Trigger<T> {
  _promise!: Promise<T>;
  _wake!: (arg: T) => void;

  constructor () {
    this.reset();
  }

  wait (): Promise<T> {
    return this._promise;
  }

  wake (arg: T) {
    this._wake(arg);
  }

  reset () {
    this._promise = new Promise((resolve) => {
      this._wake = resolve;
    });
  }
}
