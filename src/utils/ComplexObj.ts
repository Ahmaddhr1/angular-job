import { AdminObj } from "./AdminObj";
import { BuildingObj } from "./BuildingObj";

export type ComplexObj = {
  id: number;
  name: string;
  address: string;
  campaign_info: string;
  admin: AdminObj;
  buildings: BuildingObj[];
};