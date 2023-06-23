import { CourseInterface } from 'interfaces/course';
import { GetQueryInterface } from 'interfaces';

export interface LiveClassInterface {
  id?: string;
  name: string;
  start_time: any;
  end_time: any;
  course_id?: string;
  created_at?: any;
  updated_at?: any;

  course?: CourseInterface;
  _count?: {};
}

export interface LiveClassGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  course_id?: string;
}
