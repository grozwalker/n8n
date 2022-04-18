import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class AmplitudeApi implements ICredentialType {
	name = 'amplitudeApi';
	displayName = 'Amplitude API';
	documentationUrl = 'amplitude';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}
