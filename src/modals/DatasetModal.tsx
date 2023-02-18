import { Button, Loading, Modal } from '@nextui-org/react'
import { Col, Form, Row } from '@ui'
import InputField from '@ui/input/InputField'
import InputLabel from '@ui/input/InputLabel'
import TextareaField from '@ui/input/TextareaField'
import SubTitle from '@ui/text/SubTitle'
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import { useResponsive } from 'src/hooks/useResponsive'
import { useUser } from 'src/hooks/useUser'
import { createFirestoreData } from 'src/utils/firestore'

export type TDatasetPayload = {
  isCreate: boolean
  datasetId?: string
  name?: string
}

export type TDatasetValues = {
  name: string
  prompt?: string
  completion?: string
}

const defaultValues: TDatasetValues = {
  name: '',
  prompt: '',
  completion: '',
}

function DatasetModal() {
  const { open, payload, toggle } = useModal<TDatasetPayload>()
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TDatasetValues>({
    defaultValues: payload?.isCreate
      ? defaultValues
      : { name: payload?.name ?? '' },
  })
  const { isMobile } = useResponsive()
  const [loading, setLoading] = useState<boolean>(false)
  const user = useUser()

  const onSubmit = useCallback(
    (data: TDatasetValues) => {
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
    ({ name, prompt, completion }: TDatasetValues) => {
      if (user?.uid) {
        if (completion && prompt) {
          setLoading(true)
          const batch = writeBatch(firestore)
          const datasetRef = doc(collection(firestore, 'datasets'))
          const dataRef = doc(
            collection(firestore, 'datasets', datasetRef.id, 'data')
          )
          const userRef = doc(collection(firestore, 'users'), user.uid)
          batch.set(
            datasetRef,
            createFirestoreData<TDataset>(
              {
                name,
                userId: user.uid,
                userRef,
              },
              { admin: user.admin }
            )
          )
          batch.set(
            dataRef,
            createFirestoreData<TDatasetData>(
              {
                prompt,
                completion,
                parentId: datasetRef.id,
                parentRef: datasetRef,
                userId: user.uid,
                userRef, // TODO: change to authenticated user ref
              },
              { admin: user.admin }
            )
          )
          batch
            .commit()
            .then(() => {
              console.log('batch commited!')
              setLoading(false)
              toggle()
            })
            .catch((err) => {
              console.error(err)
              setLoading(false)
              toggle()
            })
        } else {
          const userRef = doc(collection(firestore, 'users'), user.uid)
          setLoading(true)
          addDoc(
            collection(firestore, 'datasets'),
            createFirestoreData<TDataset>(
              {
                name,
                userId: user.uid,
                userRef,
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
      }
    },
    [user]
  )

  const onUpdate = useCallback(
    (data: TDatasetValues) => {
      if (payload?.datasetId) {
        const docRef = doc(collection(firestore, 'datasets'), payload.datasetId)
        setLoading(true)
        updateDoc(docRef, {
          name: data.name,
        })
          .then(() => {
            console.log(payload.datasetId, 'updated!')
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
      open={open === 'dataset-modal'}
      width="60rem"
      onClose={() => toggle()}
    >
      {!payload?.isCreate ? (
        <Modal.Header css={{ pb: 0 }}>
          <SubTitle css={{ mt: 0 }}>Edit Dataset</SubTitle>
        </Modal.Header>
      ) : null}
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
            <Row
              css={{
                fg: !payload?.isCreate ? 1 : 0,
                mb: payload?.isCreate ? '$0' : '$10',
              }}
            >
              <Col>
                <InputLabel>Dataset Name</InputLabel>
                <InputField
                  css={{ fg: 1 }}
                  aria-label="Dataset Name Text Input"
                  autoFocus
                  bordered
                  color="secondary"
                  control={control}
                  helperColor="error"
                  helperText={errors.name?.message}
                  name="name"
                  placeholder="Enter Dataset Name"
                  rules={{ required: 'Dataset Name is required!' }}
                  size="lg"
                  status={errors.name ? 'error' : 'default'}
                />
              </Col>
            </Row>
            {payload?.isCreate ? (
              <>
                <Row>
                  <Col>
                    <InputLabel>Prompt</InputLabel>
                    <TextareaField
                      aria-label="Prompt"
                      bordered
                      color="secondary"
                      control={control}
                      fullWidth
                      helperColor="error"
                      helperText={errors.prompt?.message}
                      minRows={isMobile ? 4 : 6}
                      maxRows={20}
                      name="prompt"
                      placeholder="Enter prompt here"
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
                      minRows={isMobile ? 4 : 6}
                      maxRows={20}
                      name="completion"
                      placeholder="Enter completion here"
                      size="lg"
                      status={errors.completion && 'error'}
                    />
                  </Col>
                </Row>
              </>
            ) : null}
            <Row css={{ mt: '$lg' }} justify="space-between" wrap="wrap">
              <Col>
                <Button
                  css={{
                    mb: '$5',
                    '@xsMax': {
                      fg: 1,
                    },
                  }}
                  color="gradient"
                  disabled={loading}
                  shadow
                  size="xl"
                  type="submit"
                >
                  {loading ? (
                    <Loading
                      type="points-opacity"
                      color="secondary"
                      size="xl"
                    />
                  ) : payload?.isCreate ? (
                    'Create Dataset'
                  ) : (
                    'Update Dataset'
                  )}
                </Button>
              </Col>
            </Row>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default DatasetModal
