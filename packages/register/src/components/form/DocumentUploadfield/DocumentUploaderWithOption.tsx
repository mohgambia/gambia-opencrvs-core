import {
  ImageUploader,
  ISelectOption,
  Select
} from '@opencrvs/components/lib/forms'
import { ErrorText } from '@opencrvs/components/lib/forms/ErrorText'
import { DocumentPreview } from '@register/components/form/DocumentUploadfield/DocumentPreview'
import { IFileValue, IFormFieldValue, IAttachmentValue } from '@register/forms'
import { ALLOWED_IMAGE_TYPE, EMPTY_STRING } from '@register/utils/constants'
import * as Jimp from 'jimp'
import * as React from 'react'
import { WrappedComponentProps as IntlShapeProps, injectIntl } from 'react-intl'
import styled from 'styled-components'
import { DocumentListPreview } from './DocumentListPreview'
import { remove, clone } from 'lodash'
import { buttonMessages } from '@register/i18n/messages'
import { messages } from '@register/i18n/messages/views/imageUpload'

const UploaderWrapper = styled.div`
  margin-bottom: 20px;
`
const Label = styled.label`
  position: relative;
  top: -2px;
  color: ${({ theme }) => theme.colors.copy};
  ${({ theme }) => theme.fonts.bodyStyle};
`
const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export const ErrorMessage = styled.div`
  margin-bottom: 20px;
`
const DocumentUploader = styled(ImageUploader)`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.white};
  border: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  box-shadow: 0px 2px 6px rgba(53, 67, 93, 0.32);
  border-radius: 2px;
  ${({ theme }) => theme.fonts.buttonStyle};
  height: 40px;
  text-transform: initial;
  margin-left: 10px;
  padding: 0px 30px;

  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    margin-left: 0px;
    margin-top: 10px;
  }
`

type IFullProps = {
  name: string
  label: string
  extraValue: IFormFieldValue
  options: ISelectOption[]
  files?: IFileValue[]
  onComplete: (files: IFileValue[]) => void
} & IntlShapeProps

type DocumentFields = {
  documentType: string
  documentData: string
}

type FileId = number
type IFileValueWithId = IFileValue & { id?: FileId }

type IState = {
  errorMessage: string
  fields: DocumentFields
  uploadedDocuments: IFileValueWithId[]
  previewImage: IFileValueWithId | null
  filesBeingProcessed: FileId[]
  dropDownOptions: ISelectOption[]
}

export const getBase64String = (file: File) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.result) {
        return resolve(reader.result)
      }
    }
    reader.onerror = error => reject(error)
  })
}

class DocumentUploaderWithOptionComp extends React.Component<
  IFullProps,
  IState
> {
  constructor(props: IFullProps) {
    super(props)
    this.state = {
      errorMessage: EMPTY_STRING,
      previewImage: null,
      uploadedDocuments: this.props.files || [],
      dropDownOptions: this.initializeDropDownOption(),
      filesBeingProcessed: [],
      fields: {
        documentType: EMPTY_STRING,
        documentData: EMPTY_STRING
      }
    }
  }

  initializeDropDownOption = (): ISelectOption[] => {
    const options = clone(this.props.options)
    this.props.files &&
      this.props.files.forEach((element: IFileValue) => {
        remove(
          options,
          (option: ISelectOption) => option.value === element.optionValues[1]
        )
      })

    return options
  }

  onChange = (documentType: string) => {
    const currentState = this.state
    currentState.fields.documentType = documentType
    this.setState(currentState)
  }

  isValid = (): boolean => {
    const isValid = !!this.state.fields.documentType

    this.setState({
      errorMessage: isValid
        ? EMPTY_STRING
        : this.props.intl.formatMessage(messages.documentTypeRequired)
    })

    return isValid
  }

  processImage = async (uploadedImage: File) => {
    console.time('total')
    console.time('calculate base64')
    let fileAsBase64 = await getBase64String(uploadedImage)
    console.timeEnd('calculate base64')
    const base64Data = fileAsBase64.toString().split('base64,')[1]
    const buffer = new Buffer(base64Data, 'base64')
    console.time('read to JIMP')
    const image = await Jimp.read(buffer)
    console.timeEnd('read to JIMP')

    if (!ALLOWED_IMAGE_TYPE.includes(image.getMIME())) {
      this.setState({
        errorMessage: this.props.intl.formatMessage(messages.uploadError)
      })
      throw new Error('File type not supported')
    }

    if (uploadedImage.size > 5242880) {
      this.setState({
        errorMessage: this.props.intl.formatMessage(messages.overSized)
      })
      throw new Error(this.props.intl.formatMessage(messages.overSized))
    }

    if (uploadedImage.size > 2097152) {
      console.time('resize')
      fileAsBase64 = await image
        .resize(2000, Jimp.AUTO)
        .quality(70)
        .getBase64Async(image.getMIME())
      console.timeEnd('resize')
    }

    const optionValues = [this.props.extraValue, this.state.fields.documentType]

    let tempOptions = this.state.dropDownOptions
    remove(
      tempOptions,
      (option: ISelectOption) => option.value === this.state.fields.documentType
    )

    this.setState(
      prevState => {
        const newDocument: IFileValue = {
          optionValues,
          type: uploadedImage.type,
          data: fileAsBase64.toString()
        }

        return {
          ...prevState,
          errorMessage: EMPTY_STRING,
          fields: {
            documentType: EMPTY_STRING,
            documentData: EMPTY_STRING
          },
          uploadedDocuments: [...prevState.uploadedDocuments, newDocument],
          dropDownOptions: tempOptions
        }
      },
      () => {
        console.timeEnd('total')
        this.props.onComplete(this.state.uploadedDocuments)
      }
    )
  }

  handleFileChange = async (uploadedImage: File) => {
    if (!uploadedImage) {
      return
    }

    try {
      await this.processImage(uploadedImage)
    } catch (e) {
      this.setState({
        errorMessage:
          this.state.errorMessage ||
          this.props.intl.formatMessage(messages.uploadError)
      })
    }
  }

  onDelete = (image: IFileValue | IAttachmentValue) => {
    const previewImage = image as IFileValue
    const addableOption = this.props.options.find(
      (item: ISelectOption) => item.value === previewImage.optionValues[1]
    ) as ISelectOption
    const dropDownOptions = this.state.dropDownOptions.concat(addableOption)
    this.setState(() => ({ dropDownOptions }))
    remove(
      this.state.uploadedDocuments,
      (item: IFileValue) => item === previewImage
    )

    this.props.onComplete(this.state.uploadedDocuments)
    this.closePreviewSection()
  }

  closePreviewSection = () => {
    this.setState({ previewImage: null })
  }

  selectForPreview = (previewImage: IFileValue | IAttachmentValue) => {
    this.setState({ previewImage: previewImage as IFileValue })
  }

  render() {
    const { label, intl } = this.props

    return (
      <UploaderWrapper>
        <ErrorMessage>
          {this.state.errorMessage && (
            <ErrorText>{this.state.errorMessage}</ErrorText>
          )}
        </ErrorMessage>

        <Label>{label}</Label>
        <DocumentListPreview
          documents={this.state.uploadedDocuments}
          onSelect={this.selectForPreview}
        />
        <Flex>
          <Select
            options={this.state.dropDownOptions}
            value={this.state.fields.documentType}
            onChange={this.onChange}
          />

          <DocumentUploader
            id="upload_document"
            title="Add file"
            onClick={e => !this.isValid() && e.preventDefault()}
            handleFileChange={this.handleFileChange}
          />
        </Flex>

        {this.state.previewImage && (
          <DocumentPreview
            previewImage={this.state.previewImage}
            title={intl.formatMessage(buttonMessages.preview)}
            goBack={this.closePreviewSection}
            onDelete={this.onDelete}
          />
        )}
      </UploaderWrapper>
    )
  }
}

export const DocumentUploaderWithOption = injectIntl<'intl', IFullProps>(
  DocumentUploaderWithOptionComp
)
