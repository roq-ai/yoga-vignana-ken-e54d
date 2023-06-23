import { LiveClassInterface } from 'interfaces/live-class';
import { RecordedClassInterface } from 'interfaces/recorded-class';
import { SubscriptionInterface } from 'interfaces/subscription';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface CourseInterface {
  id?: string;
  name: string;
  description: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  live_class?: LiveClassInterface[];
  recorded_class?: RecordedClassInterface[];
  subscription?: SubscriptionInterface[];
  organization?: OrganizationInterface;
  _count?: {
    live_class?: number;
    recorded_class?: number;
    subscription?: number;
  };
}

export interface CourseGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  organization_id?: string;
}
