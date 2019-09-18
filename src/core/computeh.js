export const computeh = {
    data() {
        return {
            w_height: 0
        }
    },
    mounted() {
        this.w_height = window.innerHeight;
        window.onresize = () => {
            this.w_height = window.innerHeight;
        }
    },
    computed: {
        //默认表格高度
        w_defaultHeight: function(){
            return this.w_height - 180;
        },
        //带分页时的表格高度
        w_paginationHeight: function(){
            return this.w_defaultHeight - 63;
        },
        //左右布局下，容器的高度
        w_splitHeight: function(){
            return (this.w_height -130) + "px";
        },
        //左右布局下，右侧表格的高度
        w_splitTableHeight: function(){
            return this.w_height - 190;
        }
    }
}