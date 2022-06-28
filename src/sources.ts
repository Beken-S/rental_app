import { HomyAPI, SourceHomyAPI } from './API/homy-api.js';
import { FlatRentSdk } from './SDK/flat-rent-sdk.js';

export type SourceName = SourceHomyAPI | 'Flat-Rent-SDK';
export type SourceAPI = HomyAPI | FlatRentSdk;

export interface ISource {
  name: SourceName;
  api: SourceAPI;
}

export function isISource(object: unknown): object is ISource {
  if (typeof object === 'object') {
    return 'name' in object && 'api' in object;
  }
  return false;
}

export function isISourceArray(array: unknown): array is ISource[] {
  if (Array.isArray(array)) {
    return array.every((item) => isISource(item));
  }
  return false;
}

export interface IHomyAPISource extends ISource {
  name: SourceHomyAPI;
  api: HomyAPI;
}

export interface IFlatRentSource extends ISource {
  name: 'Flat-Rent-SDK';
  api: FlatRentSdk;
}

export function isHomyAPISource(source: ISource): source is IHomyAPISource {
  return source.name === 'Homy-API';
}

export function isFlatRentSource(source: ISource): source is IFlatRentSource {
  return source.name === 'Flat-Rent-SDK';
}

export function createSource(name: SourceName): ISource {
  switch (name) {
    case 'Homy-API':
      return {
        name: 'Homy-API',
        api: new HomyAPI(),
      };
    case 'Flat-Rent-SDK':
      return {
        name: 'Flat-Rent-SDK',
        api: new FlatRentSdk(),
      };
    default:
  }
}
