import { Button, Loading, Modal } from '@nextui-org/react'
import { Col, Form, Row } from '@ui'
import InputLabel from '@ui/input/InputLabel'
import TextareaField from '@ui/input/TextareaField'
import SubTitle from '@ui/text/SubTitle'
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import { useResponsive } from 'src/hooks/useResponsive'
import { useUser } from 'src/hooks/useUser'
import { createFirestoreData } from 'src/utils/firestore'

export type TDatasetDataPayload = {
  isCreate: boolean
  datasetDataId?: string
  parentId?: string
  parentRef?: DocumentReference
  prompt: string
  completion: string
}

export type TDatasetDataValues = {
  prompt: string
  completion: string
}

const defaultValues: TDatasetDataValues = {
  prompt: '',
  completion: '',
}

function DatasetDataModal() {
  const { open, payload, toggle } = useModal<TDatasetDataPayload>()
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TDatasetDataValues>({
    defaultValues: payload?.isCreate
      ? defaultValues
      : {
          prompt: payload?.prompt ?? '',
          completion: payload?.completion ?? '',
        },
  })
  const { isMobile } = useResponsive()
  const [loading, setLoading] = useState<boolean>(false)
  const user = useUser()

  const onSubmit = useCallback(
    (data: TDatasetDataValues) => {
      if (!isDirty) return
      if (payload?.isCreate) {
        onCreate(data)
      } else {
        onUpdate(data)
      }
    },
    [isDirty, payload]
  )

  const onCreate = useCallback(
    ({ prompt, completion }: TDatasetDataValues) => {
      if (payload && payload.parentId && user) {
        setLoading(true)
        addDoc(
          collection(firestore, 'datasets', payload.parentId, 'data'),
          createFirestoreData<TDatasetData>(
            {
              prompt,
              completion,
              parentId: payload.parentId,
              parentRef: payload.parentRef,
              userId: user.uid,
              userRef: doc(collection(firestore, 'users'), user.uid),
            },
            { admin: user.admin }
          )
        )
          .then((doc) => {
            console.log(doc.id, 'created!')
            setLoading(false)
            toggle()
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
            toggle()
          })
      }
    },
    [payload, user]
  )

  const onUpdate = useCallback(
    ({ prompt, completion }: TDatasetDataValues) => {
      if (payload?.parentId && payload?.datasetDataId) {
        setLoading(true)
        const docRef = doc(
          collection(firestore, 'datasets'),
          payload.parentId,
          'data',
          payload.datasetDataId
        )
        updateDoc(docRef, {
          prompt,
          completion,
        })
          .then(() => {
            console.log(docRef.id, 'updated!')
            setLoading(false)
            toggle()
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
            toggle()
          })
      }
    },
    [payload]
  )

  return (
    <Modal
      blur
      closeButton
      fullScreen={isMobile}
      open={open === 'dataset-data-modal'}
      width="60rem"
      onClose={() => toggle()}
    >
      <Modal.Header css={{ pb: 0 }}>
        <SubTitle css={{ mt: 0 }}>{`${
          payload?.isCreate ? 'New' : 'Edit'
        } Dataset Data`}</SubTitle>
      </Modal.Header>
      <Modal.Body css={{ pt: 0 }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Col
            flex
            css={{
              '@xsMax': {
                pb: '$18',
              },
            }}
          >
            <Row>
              <Col>
                <InputLabel>Prompt</InputLabel>
                <TextareaField
                  aria-label="Prompt"
                  autoFocus
                  bordered
                  color="secondary"
                  control={control}
                  fullWidth
                  helperColor="error"
                  helperText={errors.prompt?.message}
                  minRows={isMobile ? 2 : 3}
                  maxRows={20}
                  name="prompt"
                  placeholder="Enter prompt here"
                  rules={{ required: 'Prompt is required!' }}
                  size="lg"
                  status={errors.prompt && 'error'}
                />
              </Col>
            </Row>
            <Row flex>
              <Col stretch>
                <InputLabel>Completion</InputLabel>
                <TextareaField
                  aria-label="Completion"
                  bordered
                  color="secondary"
                  control={control}
                  fullWidth
                  helperColor="error"
                  helperText={errors.completion?.message}
                  minRows={isMobile ? 7 : 8}
                  maxRows={12}
                  name="completion"
                  placeholder="Enter completion here"
                  rules={{ required: 'Completion is required!' }}
                  size="lg"
                  status={errors.completion && 'error'}
                />
              </Col>
            </Row>
            <Row css={{ mt: '$lg' }}>
              <Button
                css={{
                  fg: 1,
                  mb: '$5',
                }}
                color="gradient"
                disabled={loading}
                shadow
                size="xl"
                type="submit"
              >
                {loading ? (
                  <Loading type="points-opacity" color="secondary" size="xl" />
                ) : payload?.isCreate ? (
                  'Create Dataset Data'
                ) : (
                  'Update Dataset Data'
                )}
              </Button>
            </Row>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default DatasetDataModal
