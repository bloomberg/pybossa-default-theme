const selectedComponentProps =  function(template){
    const paramsPattern = /[^{\}]+(?=})/g;
    return [...new Set(template.match(paramsPattern))];
};
const textInputTemplate = require( "!!html-loader!./components/templates/TextInputTemplate.html");
const checkboxInputTemplate = require( "!!html-loader!./components/templates/CheckboxTemplate.html");
const RadioInputTemplate = require( "!!html-loader!./components/templates/RadioInputTemplate.html");
const InstructionPanelTemplate = require( "!!html-loader!./components/templates/InstructionPanelTemplate.html");


export default {
    getComponentsProps: function(){
        return {
            "id": { name:"id", valueType: "String", formInputType: 'String' },
            "initial-value": { name:"initial-value", valueType: "Boolean", formInputType: 'Boolean' },
            "choices": { name:"choices", valueType: "List", formInputType: 'String'  },
            "label": { name:"label", valueType: "String", formInputType: 'String' },
            "pyb-answer": { name:"pyb-answer", valueType: "String", formInputType: 'String' },
        }
    },
    getComponentsDetails: function(){
        return [
                {   id: 'text-input', 
                    name: "Text Input", 
                    template: textInputTemplate,
                    type: 'String',
                    props: selectedComponentProps(textInputTemplate)
                },
                {   id: 'checkbox-input', 
                    name: "Checkbox", 
                    template: checkboxInputTemplate ,
                    type: "Boolean",
                    props: selectedComponentProps(checkboxInputTemplate)
                },
                // {   id: 'radio-input', 
                //     name: "Radio Input", 
                //     template: RadioInputTemplate,
                //     type: "Boolean",
                //     props: selectedComponentProps(RadioInputTemplate)

                // },
                // {
                //     id: 'instructions-panel',
                //     name: 'Instruction Panel',
                //     template: InstructionPanelTemplate,
                //     type: 'String',
                //     props: selectedComponentProps(InstructionPanelTemplate)

                // }
                // {   id: 'dropdown-input', 
                //     name: "Dropdown Input", 
                //     template: require( "!!html-loader!./components/templates/DropdownInputTemplate.html"),
                //     type: "String"
                // },
            ]
        
    },
    
}