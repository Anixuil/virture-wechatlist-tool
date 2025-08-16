import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup
} from 'unocss';

export default defineConfig({
    rules: [
        [/^rotate-0.([\.\d]+)$/, ([_, num]) => ({ transform: `rotate(0.${num}turn)` })],
        ['img-box', { 'border-radius': '50%', display: 'inline-block', overflow: 'hidden' }],   // 图片盒子
        [/^lt-radius-([\.\d]+)$/, ([_, num]) => ({ 'border-top-left-radius': `${num}px` })],
        [/^rt-radius-([\.\d]+)$/, ([_, num]) => ({ 'border-top-right-radius': `${num}px` })],
        [/^lb-radius-([\.\d]+)$/, ([_, num]) => ({ 'border-bottom-left-radius': `${num}px` })],
        [/^rb-radius-([\.\d]+)$/, ([_, num]) => ({ 'border-bottom-right-radius': `${num}px` })],
        ['ani-icon', { 'width': '20px', 'height': '20px', 'display': 'inline-block'}],   // icon样式
    ],
    shortcuts: [

    ],
    theme: {
        colors:{}
    },
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            collections: {
                ep: () => import('@iconify-json/ep/icons.json').then((i) => i.default),
            }
        }),
        presetTypography(),
        presetWebFonts({
            fonts: {
                
            }
        }),
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()]
})