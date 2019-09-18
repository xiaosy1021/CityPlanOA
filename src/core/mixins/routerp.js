/* eslint-disable */
export const routerparams = {
    data() {
        return {
            IP: "",
            AppId: ""

        };
    },
    mounted() {
        this.IP = this.$route.params.IP;
        this.AppId = this.$route.params.AppId;
    },
    methods: {
        convertRouterPath(path){
            if(path){
                return path.replace(':IP',this.IP).replace(':AppId',this.AppId);
            }
        }
    }
};