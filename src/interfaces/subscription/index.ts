import { UserInterface } from 'interfaces/user';
import { CourseInterface } from 'interfaces/course';
import { GetQueryInterface } from 'interfaces';

export interface SubscriptionInterface {
  id?: string;
  user_id?: string;
  course_id?: string;
  start_date: any;
  end_date: any;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  course?: CourseInterface;
  _count?: {};
}

export interface SubscriptionGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  course_id?: string;
}
