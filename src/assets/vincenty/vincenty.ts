import { Injectable } from '@angular/core';
import { Coordinates } from '@global-user/models/edit-profile.model';

@Injectable({ providedIn: 'any' })
export class VincentySerivce {
  public calculateEarthDistance(origin: Coordinates, destanation: Coordinates): number {
    const a = 6378137;
    const b = 6356752.314245;
    const f = 1 / 298.257223563;

    const L = this.toRad(destanation.longitude - origin.longitude);
    const U1 = Math.atan((1 - f) * Math.tan(this.toRad(origin.latitude)));
    const U2 = Math.atan((1 - f) * Math.tan(this.toRad(destanation.latitude)));
    const sinU1 = Math.sin(U1);
    const cosU1 = Math.cos(U1);
    const sinU2 = Math.sin(U2);
    const cosU2 = Math.cos(U2);

    let iterLimit = 100;
    let lambda = L;
    let lambdaP;
    let sinLambda;
    let cosLambda;
    let sinSigma;
    let cosSigma;
    let sigma;
    let sinAlpha;
    let cosSqAlpha;
    let cos2SigmaM;

    do {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt(
        cosU2 * sinLambda * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
      );

      if (sinSigma === 0) {
        return 0;
      }

      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;

      if (isNaN(cos2SigmaM)) {
        cos2SigmaM = 0;
      }

      const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

    if (iterLimit === 0) {
      return NaN;
    }

    const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
    const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma =
      B *
      sinSigma *
      (cos2SigmaM +
        (B / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    const s = b * A * (sigma - deltaSigma);

    return Number(s.toFixed(3));
  }

  private toRad(Value) {
    return (Value * Math.PI) / 180;
  }
}
