import { useUIStore } from '@/stores/uiStore';

type Language = 'en' | 'zh';

type Dict = Record<string, string>;

const en: Dict = {
  app_title: 'BarberMatch',
  create_account: 'Create your account',
  welcome_back: 'Welcome back',
  full_name: 'Full Name',
  email: 'Email',
  password: 'Password',
  sign_up: 'Sign Up',
  sign_in: 'Sign In',
  loading: 'Loading...',
  have_account: 'Already have an account? Sign In',
  no_account: "Don't have an account? Sign Up",
  choose_language: 'Language',
  english: 'English',
  chinese: '中文',
  // Tabs / headers
  home: 'Home',
  discover: 'Discover',
  appointments: 'Appointments',
  settings: 'Settings',
  dashboard: 'Dashboard',
  services: 'Services',
  profile: 'Profile',
  profile_settings: 'Profile & Settings',
  // Barber dashboard sections
  pending_requests: 'Pending Requests',
  todays_schedule: "Today's Schedule",
  quick_actions: 'Quick Actions',
  no_pending: 'No pending requests',
  no_appointments_today: 'No appointments today',
};

const zh: Dict = {
  app_title: 'BarberMatch',
  create_account: '创建账户',
  welcome_back: '欢迎回来',
  full_name: '姓名',
  email: '邮箱',
  password: '密码',
  sign_up: '注册',
  sign_in: '登录',
  loading: '加载中...',
  have_account: '已有账户？登录',
  no_account: '没有账户？注册',
  choose_language: '语言',
  english: '英文',
  chinese: '中文',
  // Tabs / headers
  home: '首页',
  discover: '发现',
  appointments: '预约',
  settings: '设置',
  dashboard: '仪表板',
  services: '服务',
  profile: '资料',
  profile_settings: '资料与设置',
  // Barber dashboard sections
  pending_requests: '待处理请求',
  todays_schedule: '今日日程',
  quick_actions: '快捷操作',
  no_pending: '暂无待处理请求',
  no_appointments_today: '今天没有预约',
};

const dictionaries: Record<Language, Dict> = { en, zh };

export function t(key: string): string {
  // Hook-aware accessor for current language
  const lang: Language = useUIStore.getState().language;
  return dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
}

export function getLanguages(): { code: Language; label: string }[] {
  return [
    { code: 'en', label: en.english },
    { code: 'zh', label: en.chinese },
  ];
}

export type { Language };

