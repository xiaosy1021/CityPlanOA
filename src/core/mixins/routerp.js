/* eslint-disable */
export const routerparams = {
    data() {
        return {
            IP: "",
            AppId: "",
        };
    },
    mounted() {
        this.IP = this.$route.params.IP || "122.193.33.86:8006";
        this.AppId = this.$route.params.AppId || "SX_KJXX";
    },
    methods: {
        convertRouterPath(path){
            if(path){
                return path.replace(':IP',this.IP).replace(':AppId',this.AppId);
            }
        }
    }
};