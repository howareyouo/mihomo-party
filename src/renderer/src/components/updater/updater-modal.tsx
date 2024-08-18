import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Code
} from '@nextui-org/react'
import ReactMarkdown from 'react-markdown'
import React, { useState } from 'react'
import { downloadAndInstallUpdate } from '@renderer/utils/ipc'

interface Props {
  version: string
  changelog: string
  onClose: () => void
}
const UpdaterModal: React.FC<Props> = (props) => {
  const { version, changelog, onClose } = props
  const [downloading, setDownloading] = useState(false)
  const onUpdate = async (): Promise<void> => {
    try {
      await downloadAndInstallUpdate(version)
    } catch (e) {
      alert(e)
    }
  }

  return (
    <Modal
      backdrop="blur"
      hideCloseButton
      isOpen={true}
      onOpenChange={onClose}
      scrollBehavior="inside"
    >
      <ModalContent className="h-full w-[calc(100%-100px)]">
        <ModalHeader className="flex">v{version} 版本就绪</ModalHeader>
        <ModalBody className="h-full">
          <ReactMarkdown
            className="markdown-body select-text"
            components={{
              code: ({ children }) => <Code size="sm">{children}</Code>,
              h3: ({ ...props }) => <h3 className="text-lg font-bold" {...props} />,
              li: ({ children }) => <li className="list-disc list-inside">{children}</li>
            }}
          >
            {changelog}
          </ReactMarkdown>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            isLoading={downloading}
            onPress={async () => {
              try {
                setDownloading(true)
                await onUpdate()
                onClose()
              } catch (e) {
                alert(e)
              } finally {
                setDownloading(false)
              }
            }}
          >
            更新
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdaterModal
