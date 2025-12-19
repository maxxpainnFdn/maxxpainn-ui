import { AlertCircle, FileX, SearchX, ServerCrash, Users, UserX, Zap } from "lucide-react";

export interface ErrorMessage {
  icon: any,
  title: string,
  description: string
}

const errorMessages: Record<string, ErrorMessage> = {
  'clan_not_found': {
    icon: Users,
    title: 'Clan Not Found',
    description: 'The clan you\'re looking for doesn\'t exist or has been disbanded.',
  },
  'post_not_found': {
    icon: FileX,
    title: 'Post Not Found',
    description: 'The post you\'re looking for doesn\'t exist or has been removed.',
  },
  'user_not_found': {
    icon: UserX,
    title: 'User Not Found',
    description: 'This user account doesn\'t exist or has been deactivated.',
  },
  'not_found': {
    icon: SearchX,
    title: 'Not Found',
    description: 'The resource you\'re looking for could not be found.',
  },
  'server_error': {
    icon: ServerCrash,
    title: 'Server Error',
    description: 'Something went wrong on our end. Please try again later.',
  },
  'system_busy': {
    icon: Zap,
    title: 'System Busy',
    description: 'The system is temporarily busy. Please wait a moment and try again.',
  },
  'generic': {
    icon: AlertCircle,
    title: 'Error',
    description: 'An error occurred. Please try again.',
  }
};

  export default errorMessages;