const Layout = () => import("@/layout/index.vue");

export default {
    path: "/program",
    name:"Program",
    component: Layout,
    redirect: "/progress",
    meta: {
        title: "项目管理",
        icon:'ele-box'
    },
    children: [
        {
            path: "/progress",
            name: "Progress",
            component: () => import("@/views/program/progress/index.vue"),
            meta: {
                title: "项目概况",
                icon:'ele-list'
            }
        },
        {
            path: "/issue",
            name: "Issue",
            component: () => import("@/views/program/issue/index.vue"),
            meta: {
                title: "问题追踪表",
                icon:'ele-document'
            }
        },
    ]
} as RouteConfigsTable;
