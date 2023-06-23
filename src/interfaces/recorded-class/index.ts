import { CourseInterface } from 'interfaces/course';
import { GetQueryInterface } from 'interfaces';

export interface RecordedClassInterface {
  id?: string;
  name: string;
  video_url: string;
  course_id?: string;
  created_at?: any;
  updated_at?: any;

  course?: CourseInterface;
  _count?: {};
}

export interface RecordedClassGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  video_url?: string;
  course_id?: string;
}
