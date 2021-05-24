export const PROPERTY = {
  name: "Radio component",
  propertys: [
    {
      Attribute: "name",
      Type: "String",
      Description: "Name of component"
    },

    {
      Attribute: "selected",
      Type: "number",
      Description: "default value "
    },

    {
      Attribute: "DataScource",
      Type: "Array",
      Description: "List item data "
    },
    {
      Attribute: "map",
      Type: "Array",
      Description: '{key: "key", text: "text"} Map data in datasource defaut'
    }
  ],
  methods: [
    {
      name: "onChange(value)",
      description: "Triggers when the binding value changes"
    }
  ],
  code: `<div style="font-family: Consolas, &quot;Courier New&quot;, monospace; line-height: 19px; white-space: pre;"><div style="line-height: 19px;"><div style="color: rgb(212, 212, 212);"><div style="line-height: 19px;"><div><span style="color: #c586c0;">import</span>&nbsp;<span style="color: #9cdcfe;">React</span>,&nbsp;{&nbsp;<span style="color: #9cdcfe;">Component</span>&nbsp;}&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'react'</span>;</div><div><span style="color: #c586c0;">import</span>&nbsp;<span style="color: #9cdcfe;">Share</span>&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'../Share'</span></div><div><span style="color: #c586c0;">import</span>&nbsp;{&nbsp;<span style="color: #9cdcfe;">PROPERTY</span>&nbsp;}&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'../../../../consts/settings/ui/radio'</span></div><div><span style="color: #c586c0;">import</span>&nbsp;<span style="color: #9cdcfe;">RadioList</span>&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'./../../RadioList'</span>;</div><div><span style="color: #569cd6;">const</span>&nbsp;<span style="color: #9cdcfe;">data</span>&nbsp;=&nbsp;[</div><div>&nbsp;&nbsp;{&nbsp;<span style="color: #9cdcfe;">key</span><span style="color: #9cdcfe;">:</span>&nbsp;<span style="color: #b5cea8;">0</span>,&nbsp;<span style="color: #9cdcfe;">text</span><span style="color: #9cdcfe;">:</span>&nbsp;<span style="color: #ce9178;">'Nữ'</span>&nbsp;},</div><div>&nbsp;&nbsp;{&nbsp;<span style="color: #9cdcfe;">key</span><span style="color: #9cdcfe;">:</span>&nbsp;<span style="color: #b5cea8;">1</span>,&nbsp;<span style="color: #9cdcfe;">text</span><span style="color: #9cdcfe;">:</span>&nbsp;<span style="color: #ce9178;">'Nam'</span>&nbsp;}</div><div>]</div><div><span style="color: #569cd6;">class</span>&nbsp;<span style="color: #4ec9b0;">UIRadio</span>&nbsp;<span style="color: #569cd6;">extends</span>&nbsp;<span style="color: #4ec9b0;">Component</span>&nbsp;{</div><div>&nbsp;&nbsp;<span style="color: #569cd6;">constructor</span>(<span style="color: #9cdcfe;">props</span>)&nbsp;{</div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #569cd6;">super</span>(<span style="color: #9cdcfe;">props</span>);</div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #569cd6;">this</span>.<span style="color: #9cdcfe;">state</span>&nbsp;=&nbsp;{</div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #9cdcfe;">selected</span><span style="color: #9cdcfe;">:</span>&nbsp;<span style="color: #569cd6;">null</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;}</div><div>&nbsp;&nbsp;}</div><div>&nbsp;&nbsp;<span style="color: #dcdcaa;">render</span>()&nbsp;{</div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #569cd6;">const</span>&nbsp;{&nbsp;<span style="color: #9cdcfe;">selected</span>&nbsp;}&nbsp;=&nbsp;<span style="color: #569cd6;">this</span>.<span style="color: #9cdcfe;">state</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #c586c0;">return</span>&nbsp;(</div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #808080;">&lt;</span><span style="color: #4ec9b0;">Share</span>&nbsp;<span style="color: #9cdcfe;">propertys</span>=<span style="color: #569cd6;">{</span><span style="color: #9cdcfe;">PROPERTY</span><span style="color: #569cd6;">}</span><span style="color: #808080;">&gt;</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #808080;">&lt;</span><span style="color: #4ec9b0;">RadioList</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #9cdcfe;">name</span>=<span style="color: #ce9178;">"gioitinh"</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #9cdcfe;">dataSource</span>=<span style="color: #569cd6;">{</span><span style="color: #9cdcfe;">data</span><span style="color: #569cd6;">}</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #9cdcfe;">onChange</span>=<span style="color: #569cd6;">{</span><span style="color: #9cdcfe;">selected</span>&nbsp;<span style="color: #569cd6;">=&gt;</span>&nbsp;<span style="color: #569cd6;">this</span>.<span style="color: #dcdcaa;">setState</span>({&nbsp;<span style="color: #9cdcfe;">selected</span>&nbsp;})<span style="color: #569cd6;">}</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #9cdcfe;">selected</span>=<span style="color: #569cd6;">{</span><span style="color: #9cdcfe;">selected</span><span style="color: #569cd6;">}</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #808080;">/&gt;</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #808080;">&lt;/</span><span style="color: #4ec9b0;">Share</span><span style="color: #808080;">&gt;</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;);</div><div>&nbsp;&nbsp;}</div><div>}</div><br><div><span style="color: #c586c0;">export</span>&nbsp;<span style="color: #c586c0;">default</span>&nbsp;<span style="color: #4ec9b0;">UIRadio</span>;</div></div></div></div></div>`
};
