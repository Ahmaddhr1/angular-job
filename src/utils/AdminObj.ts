export type AdminUser = {
  id: number;
  civility: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;  
  status: string;
  complex_id: number | null;
  complex_name: string | null;
  building_id: number | null;
  building_name: string | null;
};