import postcssMixins from 'postcss-mixins'
import postcssSimpleVars from 'postcss-simple-vars'
import postcssNested from 'postcss-nested'
import postcssColors from '@samatech/postcss-colors'

const plugins = [postcssMixins, postcssSimpleVars, postcssNested, postcssColors()]

export default {
  plugins,
}
