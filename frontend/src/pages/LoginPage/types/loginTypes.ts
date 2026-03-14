export interface LoginFormData {
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  age: number;
  gender: string;
  smoking: boolean;
  pets: boolean;
  cleanliness_level: number;
  city: string;
  groups: number[];
  user_permissions: number[];
}
