import {
  IExecuteFunctions,
} from 'n8n-core';

import {
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  OptionsWithUri,
} from 'request';

export class Amplitude implements INodeType {

  description: INodeTypeDescription = {
      displayName: 'Amplitude 1',
      name: 'amplitude',
      icon: 'file:amplitude.svg',
      group: ['transform'],
      version: 1,
      description: 'Consume Amplitude API',
      defaults: {
          name: 'Amplitude',
          color: '#1A82e2',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
				{
					name: 'amplitudeApi',
					required: true,
				},
      ],
      properties: [
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          options: [
              {
                  name: 'Contact',
                  value: 'contact',
              },
          ],
          default: 'contact',
          required: true,
          description: 'Resource to consume',
        },
        // {
        //     displayName: 'Operation',
        //     name: 'operation',
        //     type: 'options',
        //     displayOptions: {
        //         show: {
        //             resource: [
        //                 'contact',
        //             ],
        //         },
        //     },
        //     options: [
        //         {
        //             name: 'Create',
        //             value: 'create',
        //             description: 'Create a contact',
        //         },
        //     ],
        //     default: 'create',
        //     description: 'The operation to perform.',
        // },
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    operation: [
                        'create',
                    ],
                    resource: [
                        'contact',
                    ],
                },
            },
            default:'',
            description:'Primary email for the contact',
        },

          // Node properties which the user gets displayed and
          // can change on the node.
      ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    console.log('run')
    let responseData;
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    //Get credentials the user provided for this node
    // const credentials = await this.getCredentials('amplitudeApi') as IDataObject;

    if (resource === 'event') {
        if (operation === 'send') {
          console.log('run')
            // get email input
            // const event_type = this.getNodeParameter('event_type', 0) as string;
            // const user_id = this.getNodeParameter('user_id', 0) as string;

            // get additional fields input
            const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
            const data: IDataObject = {
                'api_key': 'e2bd4ddc941cdde04f5e2e8f91fbfce5',
                'events': [
                  {
                    "user_id": 'ag@test.io',
                    "event_type": 'event_type',
                  }
                ]
            };

            Object.assign(data, additionalFields);

            const options: OptionsWithUri = {
                headers: {
                    'Accept': 'application/json',
                },
                method: 'POST',
                body: data,
                uri: `https://api2.amplitude.com/2/httpapi`,
                json: true,
            };

            responseData = await this.helpers.request(options);

            console.log('responseData', responseData)
        }
    }

    // Map data to n8n data
    return [this.helpers.returnJsonArray(responseData)];
  }
}
