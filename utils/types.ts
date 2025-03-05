export interface Item {
    id: string;
    type: string;
    name: string;
    views: number | null;
    size: number | null;
    lastPlayedDate: string | null;
    dateCreated: string | null;
}

export interface ItemResponse {
    [x: string]: any;
    Type: string;
    name: string;
    views: number;
    SeriesId: string;
    SeriesName: string;
    MediaSources: {Size: number}[];
}

export type APIresponse = {
  success: boolean;
  data: any;
  error: string | null;
};