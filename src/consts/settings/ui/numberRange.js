export const PROPERTY = {
  name: "NumberRange component",
  propertys: [
    {
      Attribute: "name",
      Type: "String",
      Description: "Name of component",
      Default: "-"
    },
    {
      Attribute: "defaultNumber",
      Type: "number",
      Description: "initial value",
      Default: "1"
    },
    {
      Attribute: "min",
      Type: "number",
      Description: "Min of number range",
      Default: "0"
    },
    {
      Attribute: "max",
      Type: "number",
      Description: "Max of number range",
      Default: "-"
    },
    {
      Attribute: "height",
      Type: "number",
      Description: "height of input box",
      Default: "30"
    },
    {
      Attribute: "autoFocus",
      Type: "boolean",
      Description: "get focus when component mounted",
      Default: "false"
    }
  ],
  methods: [
    {
      name: "onChange(value)",
      description: "Triggers when the binding value changes"
    }
  ],
  code: `<div style="color: rgb(212, 212, 212); font-family: Consolas, &quot;Courier New&quot;, monospace; line-height: 19px; white-space: pre;"><div><div style="line-height: 19px;"><div><span style="color: #c586c0;">import</span>&nbsp;<span style="color: #9cdcfe;">React</span>,&nbsp;{&nbsp;<span style="color: #9cdcfe;">Component</span>&nbsp;}&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'react'</span>;</div><div><span style="color: #c586c0;">import</span>&nbsp;<span style="color: #9cdcfe;">NumberRange</span>&nbsp;<span style="color: #c586c0;">from</span>&nbsp;<span style="color: #ce9178;">'../../NumberRange'</span></div><br><div><span style="color: #569cd6;">class</span>&nbsp;<span style="color: #4ec9b0;">UINumberRange</span>&nbsp;<span style="color: #569cd6;">extends</span>&nbsp;<span style="color: #4ec9b0;">Component</span>&nbsp;{</div><div>&nbsp;&nbsp;<span style="color: #dcdcaa;">render</span>()&nbsp;{</div><div>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #c586c0;">return</span>&nbsp;(</div><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #808080;">&lt;</span><span style="color: #4ec9b0;">NumberRange</span>&nbsp;<span style="color: #9cdcfe;">max</span>=<span style="color: #569cd6;">{</span><span style="color: #b5cea8;">10</span><span style="color: #569cd6;">}</span>&nbsp;<span style="color: #9cdcfe;">onChange</span>=<span style="color: #569cd6;">{</span><span style="color: #9cdcfe;">e</span>&nbsp;<span style="color: #569cd6;">=&gt;</span>&nbsp;<span style="color: #4ec9b0;">console</span>.<span style="color: #dcdcaa;">log</span>(<span style="color: #9cdcfe;">e</span>)<span style="color: #569cd6;">}</span>&nbsp;<span style="color: #808080;">/&gt;</span></div><div>&nbsp;&nbsp;&nbsp;&nbsp;);<br></div><div>&nbsp;&nbsp;}</div><div>}</div><br><div><span style="color: #c586c0;">export</span>&nbsp;<span style="color: #c586c0;">default</span>&nbsp;<span style="color: #9cdcfe;">UINumberRange</span>;</div><br></div></div><br></div>`
};
