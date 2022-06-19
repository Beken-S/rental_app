// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlace {}

export interface IShowPlace {
  (error?: Error, places?: IPlace[]): void;
}

export function showPlace(error?: Error, places?: IPlace[]): void {
  if (error == null && places != null) {
    console.log(places);
  } else {
    console.error(error);
  }
}
