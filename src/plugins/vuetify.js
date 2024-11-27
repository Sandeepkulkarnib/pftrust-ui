import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        light: true,
        themes: {
            "light": {
                "primary": "#dc3545",
                "secondary": "#3f51b5",
                "accent": "#4caf50",
                "error": "#f44336",
                "warning": "#ff9800",
                "info": "#ffeb3b",
                "success": "#8bc34a"
            }
        }
    }
});
