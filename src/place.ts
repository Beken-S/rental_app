// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlace {}

export interface IPlaceCallback {
  (error?: Error, places?: IPlace[]): void;
}
