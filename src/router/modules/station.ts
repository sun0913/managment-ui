const Layout = () => import("@/layout/index.vue");

export default {
    path: "/station",
    name:"Station",
    component: Layout,
    redirect: "/site",
    meta: {
        title: "气象站管理",
        icon:'ele-sunny'
    },
    children: [
        {
            path: "/site",
            name: "Site",
            component: () => import("@/views/station/site/index.vue"),
            meta: {
                title: "站点管理",
                icon:'ele-add-location'
            }
        },
        {
            path: "/sensor",
            name: "Sensor",
            component: () => import("@/views/station/sensor/index.vue"),
            meta: {
                title: "传感器管理",
                icon:'ele-monitor'
            }
        },
        {
            path: "/simCard",
            name: "SimCard",
            component: () => import("@/views/station/sim/index.vue"),
            meta: {
                title: "SIM卡管理",
                icon:'ele-cellphone'
            }
        },
        {
            path: "/accessories",
            name: "Accessories",
            component: () => import("@/views/station/accessories/index.vue"),
            meta: {
                title: "配件管理",
                icon:'ele-collection'
            }
        },
        {
            path: "/stock",
            name: "Stock",
            component: () => import("@/views/station/stock/index.vue"),
            meta: {
                title: "库存信息",
                icon:'ele-shopping-bag'
            }
        },
    ]
} as RouteConfigsTable;
