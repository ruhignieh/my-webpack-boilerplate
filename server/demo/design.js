const URI_DEFAULT =
  'https://uploads.yinshida.com.cn/v1/uploads/03f039a9-0ab6-434d-9c3d-933f4d1c67c9~121/preview?tenant=cimpress-cn-uploads';
const CROPPER_DEFAULT = { top: 0, bottom: 0, left: 0, right: 0 };
const TEXT_DEFAULT = '';
const FONTFAMILY_DEFAULT = 'Bree Serif';

module.exports = function ({
  uri = URI_DEFAULT,
  cropperSize = CROPPER_DEFAULT,
  text = TEXT_DEFAULT,
  fontFamily = FONTFAMILY_DEFAULT,
}) {
  return {
    version: '2',
    owner: 'zPn5HmwqZl5RKCpjnmu5xaiG3b4i27L6@clients',
    tenant: 'UNKNOWN',
    document: {
      surfaces: [
        {
          id: '093548bb-145a-4e2b-8a20-5a28dd4f6042',
          name: 'label-front',
          width: '115mm',
          height: '77mm',
          images: [
            {
              id: 'item_3369',
              printUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/fa480011-aeaf-44d0-97b9-c94481263219~121/original?tenant=cimpress-cn-uploads',
              previewUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/05ec67dc-98e0-4045-a137-e9c594b38235~121?tenant=cimpress-cn-uploads',
              originalSourceUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/fa480011-aeaf-44d0-97b9-c94481263219~121/original?tenant=cimpress-cn-uploads',
              zIndex: 3,
              position: { x: '0mm', y: '0mm', width: '115mm', height: '77mm' },
              horizontalAlignment: 'left',
              verticalAlignment: 'top',
              pageNumber: 1,
            },
            {
              id: 'item_4345',
              printUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/cfc5011a-6c09-4de3-99a2-415d0c375097~121?tenant=cimpress-cn-uploads',
              previewUrl: uri,
              originalSourceUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/cfc5011a-6c09-4de3-99a2-415d0c375097~121?tenant=cimpress-cn-uploads',
              zIndex: 2,
              position: {
                x: '12.5mm',
                y: '4.5mm',
                width: '98mm',
                height: '68mm',
              },
              horizontalAlignment: 'left',
              verticalAlignment: 'top',
              cropFractions: cropperSize,
              pageNumber: 0,
            },
          ],
        },
        {
          id: 'dadce0a3-1c45-4138-b2bd-c9adf6948bc3',
          name: 'label-back',
          width: '115mm',
          height: '77mm',
          images: [
            {
              id: 'item_3534',
              printUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/2b2c71fb-9ed1-42d4-a59b-e655b3b95f81~121/original?tenant=cimpress-cn-uploads',
              previewUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/d9a521bf-cef4-4634-a7d4-b668bb18c6fc~121?tenant=cimpress-cn-uploads',
              originalSourceUrl:
                'https://uploads.yinshida.com.cn/v1/uploads/2b2c71fb-9ed1-42d4-a59b-e655b3b95f81~121/original?tenant=cimpress-cn-uploads',
              zIndex: 1,
              position: { x: '0mm', y: '0mm', width: '115mm', height: '77mm' },
              horizontalAlignment: 'left',
              verticalAlignment: 'top',
              pageNumber: 1,
            },
          ],
          textAreas: [
            {
              id: 'b87508a4-3c0b-409e-bc8a-e53ee5d0933f',
              position: {
                x: '0mm',
                y: '34.50mm',
                width: '106.65mm',
                height: '6.707mm',
              },
              horizontalAlignment: 'center',
              verticalAlignment: 'top',
              curveAlignment: 0,
              blockFlowDirection: 'horizontal-tb',
              textFields: [
                {
                  id: 'item_3699',
                  fontSize: '14pt',
                  fontStyle: 'normal',
                  fontFamily,
                  content: text,
                  color: 'rgb(#101820)',
                  inlineBaseDirection: 'ltr',
                },
              ],
              textOrientation: 'natural',
              zIndex: 4,
            },
          ],
        },
      ],
    },
    sku: 'CIM-1VK4473F',
    metadata: { dclMetadata: [], template: [] },
    fontRepositoryUrl:
      'http://cn-fonts.documents.cimpress.io/cimpress-china-font',
  };
};
