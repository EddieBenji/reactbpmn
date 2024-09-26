import 'bpmn-font/dist/css/bpmn-embedded.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModdle from 'bpmn-moddle';
import React, { Component } from 'react';
import { emptyBpmn } from '../../assets/empty.bpmn';

class BpmnModelerComponent extends Component {

    modeler = null;
    moddle = new BpmnModdle();

    componentDidMount = () => {
        this.modeler = new BpmnModeler({
            container: '#bpmnview',
            keyboard: {
                bindTo: window
            },
            propertiesPanel: {
                parent: '#propview'
            },
            additionalModules: [
                propertiesPanelModule,
                propertiesProviderModule
            ]
        });

        this.newBpmnDiagram();
    };

    newBpmnDiagram = () => {
        this.openBpmnDiagram(emptyBpmn);
    };

    openBpmnDiagram = (xml) => {
        this.modeler.importXML(xml, (error) => {
            if (error) {
                return console.log('fail import xml');
            }

            var canvas = this.modeler.get('canvas');

            canvas.zoom('fit-viewport');
        });
    };

    translateXMLtoJson = async (xml) => {
        const { rootElement: definitions } = await this.moddle.fromXML(xml);
        console.log(JSON.stringify(definitions));
    };

    exportDiagram = async () => {
        this.modeler.saveXML({ format: true }, (err, xml) => {
            if (err) {
                return console.error('could not export BPMN 2.0 diagram xml', err);
            }
            this.translateXMLtoJson(xml);
        });
    };

    render = () => {
        return (
          <div id="bpmncontainer">
              <div id="export" style={{ width: 'auto', float: 'right' }}>
                  <button onClick={this.exportDiagram}>Export</button>
              </div>
              <div id="propview" style={{ width: '25%', height: '98vh', float: 'right', maxHeight: '98vh', overflowX: 'auto' }}></div>
              <div id="bpmnview" style={{ width: '70%', height: '98vh', float: 'left', border: '1px solid black' }}></div>
          </div>
        );
    };
}

export default BpmnModelerComponent;
