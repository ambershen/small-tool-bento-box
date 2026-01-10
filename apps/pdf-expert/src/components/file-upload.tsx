import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"

interface FileUploadProps extends DropzoneOptions {
  value?: File[]
  onChange?: (files: File[]) => void
  className?: string
  description?: string
  icon?: React.ReactNode
}

export function FileUpload({
  value = [],
  onChange,
  className,
  description = "Drag & drop files here, or click to select files",
  icon,
  ...dropzoneProps
}: FileUploadProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (dropzoneProps.multiple) {
        onChange?.([...value, ...acceptedFiles])
      } else {
        onChange?.(acceptedFiles)
      }
    },
    [dropzoneProps.multiple, onChange, value]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    ...dropzoneProps,
    onDrop,
  })

  const removeFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange?.(newFiles)
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-brand-black bg-brand-white p-12 text-center transition-all hover:bg-brand-black/5 dark:border-brand-white dark:bg-brand-black dark:hover:bg-brand-white/5",
          isDragActive && "bg-brand-black/10 dark:bg-brand-white/10",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {icon || <Upload className="h-12 w-12 text-brand-black dark:text-brand-white" />}
          <p className="text-lg font-bold uppercase tracking-wide text-brand-black dark:text-brand-white">
            {isDragActive ? "Drop the files here" : description}
          </p>
          <p className="text-sm font-mono text-brand-black/60 dark:text-brand-white/60">
            Supported formats: PDF (Max 50MB)
          </p>
        </div>
      </div>

      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 grid gap-0 border-2 border-brand-black border-b-0 dark:border-brand-white"
          >
            {value.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between border-b-2 border-brand-black bg-brand-white p-4 text-sm hover:bg-brand-black/5 transition-colors dark:border-brand-white dark:bg-brand-black dark:hover:bg-brand-white/5"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <File className="h-5 w-5 flex-shrink-0 text-brand-black dark:text-brand-white" />
                  <span className="truncate font-mono font-medium uppercase dark:text-brand-white">{file.name}</span>
                  <span className="text-xs font-mono text-brand-black/60 dark:text-brand-white/60">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-brand-black hover:bg-brand-coral hover:text-brand-white rounded-none dark:text-brand-white dark:hover:bg-brand-coral dark:hover:text-brand-white"
                  onClick={(e) => removeFile(e, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
