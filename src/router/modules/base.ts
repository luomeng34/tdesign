import { DashboardIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
import {ControlPlatformIcon} from "tdesign-icons-vue/lib/icons";

export default [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/base',
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: DashboardIcon,
      single: true
    },
    children: [
      {
        path: 'base',
        name: 'DashboardBase',
        component: () => import('@/pages/dashboard/base/index.vue'),
        meta: { title: '首页' },
      },
    ],
  },
  {
    path: '/roleList',
    component: Layout,
    redirect: '/roleList',
    name: 'role',
    meta: {
      title: '权限管理',
      icon: ControlPlatformIcon,
    },
    children: [
      {
        path: 'index',
        name: 'roleIndex',
        component: () => import('@/pages/role/index.vue'),
        meta: { title: '权限列表' },
      },
    ],
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/index',
    meta: {
      title: 'banner管理',
      icon: DashboardIcon,
      single: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/pages/banner/index.vue'),
        name: 'bannerIndex',
        meta: { title: 'banner',icon: 'dashboard',affix: true },
      },
    ],
  },
  {
    path: '/operation',
    component: Layout,
    redirect: '/operation',
    name: 'operation',
    meta: {
      title: '运营管理',
      icon: ControlPlatformIcon,
    },
    children: [
      {
        path: 'forum',
        name: 'forum',
        component: () => import('@/pages/operation/forum/index.vue'),
        meta: { title: '论坛资讯' },
      },
      {
        path: 'cooperation',
        name: 'cooperation',
        component: () => import('@/pages/operation/cooperation/index.vue'),
        meta: { title: '意向合作' },
      },
      {
        path: 'questionnaire',
        name: 'questionnaire',
        component: () => import('@/pages/operation/questionnaire/index.vue'),
        meta: { title: '调研问卷' },
      },
      {
        path: 'conference',
        name: 'conference',
        component: () => import('@/pages/operation/conference/index.vue'),
        meta: { title: '大会介绍' },
      },
      {
        path: 'advance',
        name: 'advance',
        component: () => import('@/pages/operation/advance/index.vue'),
        meta: { title: '峰会预告' },
      },
      {
        path: 'review',
        name: 'review',
        component: () => import('@/pages/operation/review/index.vue'),
        meta: { title: '峰会回顾' },
      },
    ],
  },
  {
    path: '/dataList',
    component: Layout,
    redirect: '/dataList/management',
    name: 'dataList',
    meta: {
      title: '数据管理',
      icon: ControlPlatformIcon,
      single: true
    },
    children: [
      {
        path: 'management',
        name: 'management',
        component: () => import('@/pages/data-management/index.vue'),
        meta: { title: '数据管理' },
      },
    ],
  },
  {
    path: '/dataCloud',
    component: Layout,
    redirect: '/dataCloud/index',
    name: 'dataCloud',
    meta: {
      title: '云储资料',
      icon: ControlPlatformIcon,
      single: true
    },
    children: [
      {
        path: 'index',
        name: 'dataCloud',
        component: () => import('@/pages/data-cloud/index.vue'),
        meta: { title: '云储资料' },
      },
    ],
  },
];
