const baseHost = process.env.VUE_APP_BaseHost
const wsHost = process.env.VUE_APP_WsHost

export default {
    //登录
    loginAuth: baseHost + '/api/login',
    //用户管理
    userList: baseHost + '/api/user/list',
    userAdd: baseHost + '/api/user/add',
    userUpdate: baseHost + '/api/user/update',
    userUpdateAdmin: baseHost + '/api/user/updateAdmin',
    userUpdateRole: baseHost + '/api/user/updateRole',
    userDel: baseHost + '/api/user/del',
    //角色管理
    roleList: baseHost + '/api/role/list',
    roleGetAll: baseHost + '/api/role/getAll',
    roleAdd: baseHost + '/api/role/add',
    roleUpdate: baseHost + '/api/role/update',
    roleDel: baseHost + '/api/role/del',
    //角色权限管理
    roleMenuGetAll: baseHost + '/api/roleMenuRelation/getAll',
    roleMenuGetPermissions: baseHost + '/api/roleMenuRelation/getPermissions',
    // roleMenuAdd: baseHost + '/api/roleMenuRelation/add',
    roleMenuUpdate: baseHost + '/api/roleMenuRelation/update',
    // roleMenuDel: baseHost + '/api/roleMenuRelation/del',
    //环境管理
    urlEnvList: baseHost + '/api/url/env/list',
    urlEnvAdd: baseHost + '/api/url/env/add',
    urlEnvUpdate: baseHost + '/api/url/env/update',
    urlEnvDel: baseHost + '/api/url/env/del',
    //服务管理
    urlSvcList: baseHost + '/api/url/svc/list',
    urlSvcAdd: baseHost + '/api/url/svc/add',
    urlSvcUpdate: baseHost + '/api/url/svc/update',
    urlSvcDel: baseHost + '/api/url/svc/del',
    //应用管理
    appList: baseHost + '/api/app/list',
    appGet: baseHost + '/api/app/get',
    appAllRes: baseHost + '/api/app/all',
    appAdd: baseHost + '/api/app/add',
    appUpdate: baseHost + '/api/app/update',
    appDel: baseHost + '/api/app/del',
    appGetApp: baseHost + '/api/app/getApp',
    //发布管理
    deployList: baseHost + '/api/deploy/list',
    deployAdd: baseHost + '/api/deploy/add',
    deployUpdate: baseHost + '/api/deploy/update',
    deployDel: baseHost + '/api/deploy/del',
    deployLog: baseHost + '/api/deploy/getLog',
    //cicd
    cicdDeploy: baseHost + '/api/deploy/cicd',
    //所有资源数据
    k8sAllRes: baseHost + '/api/k8s/allres',
    //cluster
    k8sClusterList: baseHost + '/api/k8s/clusters',
    //event
    k8sEventList: baseHost + '/api/k8s/events',
    //namespace
    k8sNamespaceList: baseHost + '/api/k8s/namespaces',
    k8sNamespaceDetail: baseHost + '/api/k8s/namespace/detail',
    k8sNamespaceDel: baseHost + '/api/k8s/namespace',
    //deployment
    k8sDeploymentList: baseHost + '/api/k8s/deployments',
    k8sDeploymentDetail: baseHost + '/api/k8s/deployment/detail',
    k8sDeploymentUpdate: baseHost + '/api/k8s/deployment',
    k8sDeploymentScale: baseHost + '/api/k8s/deployment/scale',
    k8sDeploymentRestart: baseHost + '/api/k8s/deployment/restart',
    k8sDeploymentDel: baseHost + '/api/k8s/deployment',
    k8sDeploymentCreate: baseHost + '/api/k8s/deployment/create',
    k8sDeploymentNumNp: baseHost + '/api/k8s/deployment/numnp',
    //pod
    k8sPodList: baseHost + '/api/k8s/pods',
    k8sPodDetail: baseHost + '/api/k8s/pod/detail',
    k8sPodUpdate: baseHost + '/api/k8s/pod',
    k8sPodDel: baseHost + '/api/k8s/pod',
    k8sPodContainer: baseHost + '/api/k8s/pod/container',
    k8sPodLog: baseHost + '/api/k8s/pod/log',
    k8sPodNumNp: baseHost + '/api/k8s/pod/numnp',
    k8sTerminalWs: wsHost + '/ws',
    //ingress
    k8sIngressList: baseHost + '/api/k8s/ingresses',
    k8sIngressDetail: baseHost + '/api/k8s/ingress/detail',
    k8sIngressUpdate: baseHost + '/api/k8s/ingress',
    k8sIngressDel: baseHost + '/api/k8s/ingress',
    k8sIngressCreate: baseHost + '/api/k8s/ingress/create',
    //service
    k8sSvcList: baseHost + '/api/k8s/services',
    k8sSvcDetail: baseHost + '/api/k8s/service/detail',
    k8sSvcUpdate: baseHost + '/api/k8s/service',
    k8sSvcDel: baseHost + '/api/k8s/service',
    k8sSvcCreate: baseHost + '/api/k8s/service/create',
    //daemonset
    k8sDaemonSetList: baseHost + '/api/k8s/daemonsets',
    k8sDaemonSetDetail: baseHost + '/api/k8s/daemonset/detail',
    k8sDaemonSetUpdate: baseHost + '/api/k8s/daemonset',
    k8sDaemonSetDel: baseHost + '/api/k8s/daemonset',
    //statefulset
    k8sStatefulSetList: baseHost + '/api/k8s/statefulsets',
    k8sStatefulSetDetail: baseHost + '/api/k8s/statefulset/detail',
    k8sStatefulSetUpdate: baseHost + '/api/k8s/statefulset',
    k8sStatefulSetDel: baseHost + '/api/k8s/statefulset',
    //node
    k8sNodeList: baseHost + '/api/k8s/nodes',
    k8sNodeDetail: baseHost + '/api/k8s/node/detail',
    //pv
    k8sPvList: baseHost + '/api/k8s/pvs',
    k8sPvDetail: baseHost + '/api/k8s/pv/detail',
    k8sPvDel: baseHost + '/api/k8s/pv',
    //configmap
    k8sConfigmapList: baseHost + '/api/k8s/configmaps',
    k8sConfigmapDetail: baseHost + '/api/k8s/configmap/detail',
    k8sConfigmapUpdate: baseHost + '/api/k8s/configmap',
    k8sConfigmapDel: baseHost + '/api/k8s/configmap',
    //secret
    k8sSecretList: baseHost + '/api/k8s/secrets',
    k8sSecretDetail: baseHost + '/api/k8s/secret/detail',
    k8sSecretUpdate: baseHost + '/api/k8s/secret',
    k8sSecretDel: baseHost + '/api/k8s/secret',
    //pvc
    k8sPvcList: baseHost + '/api/k8s/pvcs',
    k8sPvcDetail: baseHost + '/api/k8s/pvc/detail',
    k8sPvcUpdate: baseHost + '/api/k8s/pvc',
    k8sPvcDel: baseHost + '/api/k8s/pvc',
    //release
    helmReleaseList: baseHost + '/api/helmstore/releases',
    helmReleaseDetail: baseHost + '/api/helmstore/release/detail',
    helmReleaseInstall: baseHost + '/api/helmstore/release/install',
    helmReleaseUninstall: baseHost + '/api/helmstore/release/uninstall',
    //chart
    helmChartList: baseHost + '/api/helmstore/charts',
    helmChartAdd: baseHost + '/api/helmstore/chart/add',
    helmChartUpdate: baseHost + '/api/helmstore/chart/update',
    helmChartDel: baseHost + '/api/helmstore/chart/del',
    helmChartFileUpload: baseHost + '/api/helmstore/chartfile/upload',
    helmChartFileDel: baseHost + '/api/helmstore/chartfile/del',
    //编辑器配置
    cmOptions: {
        // 语言及语法模式
        mode: 'text/yaml',
        // 主题
        theme: 'dracula',
        // 显示行数
        lineNumbers: true,
        smartIndent: true, //智能缩进
        indentUnit: 4, // 智能缩进单元长度为 4 个空格
        styleActiveLine: true, // 显示选中行的样式
        matchBrackets: true, //每当光标位于匹配的方括号旁边时，都会使其高亮显示
        readOnly: false,
        lineWrapping: true //自动换行
    },
    //xterm终端配置
    termOptions: {
        rendererType: 'canvas', //渲染类型
        rows: 40, //行数
        cols: 100,
        convertEol: false, //启用时，光标将设置为下一行的开头
        scrollback: 10, //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        cursorStyle: 'underline', //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
            foreground: 'white', //字体
            background: '#060101', //背景色
            cursor: 'help' //设置光标
        }
    },
    //开发语言
    appLangList: ['Java', 'Web'],
    appTypeList: ['Admin', 'Job', 'Api'],
    enList: ['prod', 't1', 't3', 'd1'],
    repoList: ['bhbl', 'fe', 'inf', 'ops'],
    visibility: ['internal', 'private', 'public']
}