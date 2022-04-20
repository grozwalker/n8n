import {
  IExecuteFunctions,
} from 'n8n-core';

import {
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  LoggerProxy as Logger,
} from 'n8n-workflow';

import {
  OptionsWithUri,
} from 'request';

export class Amplitude implements INodeType {

  description: INodeTypeDescription = {
      displayName: 'Amplitude',
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
                  name: 'Event',
                  value: 'event',
              },
          ],
          default: 'event',
          required: true,
          description: 'Resource to consume',
        },
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            displayOptions: {
                show: {
                    resource: [
                        'event',
                    ],
                },
            },
            options: [
                {
                    name: 'Send',
                    value: 'send',
                    description: 'Send an event',
                },
            ],
            default: 'send',
            description: 'The operation to perform.',
        },
        {
            displayName: 'Event Type',
            name: 'event_type',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'test_ag',
            description:'Event name',
        },
        {
            displayName: 'User ID',
            name: 'user_id',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'12345678',
            description:'User ID',
        },
        {
            displayName: 'Event Timestamp',
            name: 'event_timestamp',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'345',
            description:'Event Timestamp',
        },
        {
            displayName: 'Insert ID prefix',
            name: 'insert_id_prefix',
            type: 'string',
            required: false,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'',
            description:'Insert ID prefix',
        },
        {
            displayName: 'Event Properties',
            name: 'event_properties',
            type: 'json',
            typeOptions: {
              alwaysOpenEditWindow: true,
            },
            required: false,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'',
            description:'Event Properties',
        },
        {
            displayName: 'User Properties',
            name: 'user_properties',
            type: 'json',
            typeOptions: {
              alwaysOpenEditWindow: true,
            },
            required: false,
            displayOptions: {
                show: {
                    operation: [
                        'send',
                    ],
                    resource: [
                        'event',
                    ],
                },
            },
            default:'',
            description:'User Properties',
        },

          // Node properties which the user gets displayed and
          // can change on the node.
      ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    let responseData;
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    //Get credentials the user provided for this node
    const credentials = await this.getCredentials('amplitudeApi') as IDataObject;

    if (resource === 'event') {
        if (operation === 'send') {
            const event_type = this.getNodeParameter('event_type', 0) as string;
            const user_id = this.getNodeParameter('user_id', 0) as string;
            const event_properties = this.getNodeParameter('event_properties', 0) as string;
            const user_properties = this.getNodeParameter('user_properties', 0) as string;

            const events: {}[] = [
              {
                'user_id': user_id,
                'event_type': event_type,
              }
            ]

            if (event_properties !== '') {
              Object.assign(events[0], { 'event_properties': JSON.parse(event_properties) });
            }

            if (user_properties !== '') {
              Object.assign(events[0], { 'user_properties': JSON.parse(user_properties) });
            }

            const data: IDataObject = {
              'api_key': credentials.apiKey,
              'events': events
            };

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
        }
    }

    // Map data to n8n data
    return [this.helpers.returnJsonArray(responseData)];
  }
}
