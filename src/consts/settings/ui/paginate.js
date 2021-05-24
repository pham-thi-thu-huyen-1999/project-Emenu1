export const PROPERTY = {
  name: 'Pagination component',
  propertys: [
    {
      Attribute: 'pageCount',
      Type: 'Number',
      Description: 'Required. The total number of pages.'
    }, {
      Attribute: 'initialPage',
      Type: 'Number',
      Description: 'The initial page selected.'
    },
  ],
  methods: [{
    name: 'onChange',
    Type: 'Function',
    description: 'The method to call when a page is clicked. Exposes the current page object as an argument.'
  }],
  code: `<div style="color: rgb(212, 212, 212); font-family: Consolas, &quot;Courier New&quot;, monospace; line-height: 19px; white-space: pre;"><div><div style="font-family: Menlo, Monaco, &quot;Courier New&quot;, monospace; font-size: 12px; line-height: 18px;"><div><span style="color: #c586c0;">import</span> <span style="color: #9cdcfe;">React</span>, { <span style="color: #9cdcfe;">Component</span> } <span style="color: #c586c0;">from</span> <span style="color: #ce9178;">'react'</span>;</div><div><span style="color: #c586c0;">import</span> <span style="color: #9cdcfe;">Share</span> <span style="color: #c586c0;">from</span> <span style="color: #ce9178;">'../Share'</span>;</div><div><span style="color: #c586c0;">import</span> { <span style="color: #9cdcfe;">PROPERTY</span> } <span style="color: #c586c0;">from</span> <span style="color: #ce9178;">'../../../../consts/settings/ui/paginate'</span>;</div><div><span style="color: #c586c0;">import</span> <span style="color: #9cdcfe;">Paginate</span> <span style="color: #c586c0;">from</span> <span style="color: #ce9178;">'../../Paginate'</span>;</div><br><div><span style="color: #569cd6;">class</span> <span style="color: #4ec9b0;">UIPaginate</span> <span style="color: #569cd6;">extends</span> <span style="color: #4ec9b0;">Component</span> {</div><br><div>  <span style="color: #dcdcaa;">onChange</span> = (<span style="color: #9cdcfe;">data</span>) <span style="color: #569cd6;">=&gt;</span> {</div><div>    <span style="color: #9cdcfe;">console</span>.<span style="color: #dcdcaa;">log</span>(<span style="color: #9cdcfe;">data</span>)</div><div>  }</div><br><div>  <span style="color: #dcdcaa;">render</span>() {</div><div>    <span style="color: #c586c0;">return</span> (</div><div>      <span style="color: #808080;">&lt;</span><span style="color: #4ec9b0;">Share</span> <span style="color: #9cdcfe;">propertys</span>=<span style="color: #569cd6;">{</span><span style="color: #51b6c4;">PROPERTY</span><span style="color: #569cd6;">}</span><span style="color: #808080;">&gt;</span></div><div>        <span style="color: #808080;">&lt;</span><span style="color: #569cd6;">div</span> <span style="color: #9cdcfe;">className</span>=<span style="color: #ce9178;">"e-p-10"</span> <span style="color: #808080;">&gt;</span></div><div>          <span style="color: #808080;">&lt;</span><span style="color: #4ec9b0;">Paginate</span> <span style="color: #9cdcfe;">pageCount</span>=<span style="color: #569cd6;">{</span><span style="color: #b5cea8;">100</span><span style="color: #569cd6;">}</span> <span style="color: #9cdcfe;">initialPage</span>=<span style="color: #569cd6;">{</span><span style="color: #b5cea8;">0</span><span style="color: #569cd6;">}</span> <span style="color: #9cdcfe;">onChange</span>=<span style="color: #569cd6;">{this</span>.<span style="color: #dcdcaa;">onChange</span><span style="color: #569cd6;">}</span> <span style="color: #808080;">/&gt;</span></div><div>        <span style="color: #808080;">&lt;/</span><span style="color: #569cd6;">div</span><span style="color: #808080;">&gt;</span></div><div>      <span style="color: #808080;">&lt;/</span><span style="color: #4ec9b0;">Share</span><span style="color: #808080;">&gt;</span></div><div>    );</div><div>  }</div><div>}</div><br><div><span style="color: #c586c0;">export</span> <span style="color: #c586c0;">default</span> <span style="color: #4ec9b0;">UIPaginate</span>;</div><br></div></div></div>`
}
