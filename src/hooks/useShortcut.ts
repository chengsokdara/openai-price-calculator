import { collection, doc } from 'firebase/firestore'
import { useHotkeys } from 'react-hotkeys-hook'
import type { HotkeysEvent } from 'react-hotkeys-hook/dist/types'
import { firestore } from 'src/firebase'
import { useModal } from 'src/hooks/useModal'
import type { TDatasetDataPayload } from 'src/modals/DatasetDataModal'
import type { TDatasetPayload } from 'src/modals/DatasetModal'
import type { TDatasetDataParam } from 'src/pages/DatasetData'

export const useDatasetShortcut = <T extends HTMLElement>() => {
  const { toggle } = useModal()
  return useHotkeys<T>(
    'n',
    (_, { keys }: HotkeysEvent) => {
      if (keys) {
        switch (keys.join('')) {
          case 'n': {
            const modalPayload: TDatasetPayload = {
              isCreate: true,
            }
            toggle('dataset-modal', modalPayload)
          }
          default:
        }
      }
    },
    []
  )
}

export const useDatasetDataShortcut = <T extends HTMLElement>(
  params: TDatasetDataParam | null
) => {
  const { toggle } = useModal()
  return useHotkeys<T>(
    'n',
    (_, { keys }: HotkeysEvent) => {
      if (keys && params) {
        switch (keys.join('')) {
          case 'n': {
            const modalPayload: TDatasetDataPayload = {
              isCreate: true,
              parentId: params.datasetId,
              parentRef: doc(
                collection(firestore, 'datasets'),
                params.datasetId
              ),
              prompt: '',
              completion: '',
            }
            toggle('dataset-data-modal', modalPayload)
          }
          default:
        }
      }
    },
    [params]
  )
}
