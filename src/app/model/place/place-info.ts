import {Location} from '../location/location';
import {OpeningHours} from "../openingHours.model";
import {SpecificationValue} from "../specificationValue/specification-value";
import {CommentDto} from "../comment/commentDto";



export class PlaceInfo {
id:number;
name:string;
location: Location;
openingHoursList: OpeningHours[];
specificationValues: SpecificationValue[];
comments: CommentDto[];
rate: number;
}
