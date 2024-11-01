'use client'
import { ErrorMessage } from '@hookform/error-message'
import { ComponentConverter } from '@storybook-gpt/app/utils/componentConverter'
import React, { useState } from 'react'
import { saveStorage } from './utils/localStorage'
import { FormType, FormValues, StoriesType } from './components/main-content'

const Form = ({ form, items, setItems }: Prop) => {
  const [hasClicked, setHasClicked] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form

  const onSubmit = async (data: FormValues) => {
    setHasClicked(true)
    const { component, apiKey } = data
    const story = await ComponentConverter({
      component: component.replace(/\r?\n/g, '\\n').trim(),
      apiKey,
    })

    const storyObject = {
      name: getValues('componentName'),
      component: story || '',
    }
    setValue('story', storyObject.component)
    setItems([...items, storyObject])
    saveStorage([...items, storyObject])

    setHasClicked(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col sm:flex-row  gap-12 p-12 mb-8 bg-slate-100 shadow-lg dark:bg-[#292930] rounded-2xl"
    >
      <div className="flex flex-col items-center gap-4 w-72 md:w-64 lg:w-96 ">
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-dark dark:text-zinc-300 ">
            OPENAI API KEY
          </label>
          <input
            className={`py-3 px-4 text-dark bg-slate-300 dark:text-light dark:bg-[#00000034] rounded-xl ${
              !errors.apiKey &&
              'focus-visible:outline focus-visible:outline-[#FF4785]'
            } ${errors.apiKey && 'outline outline-1 outline-red-600'}`}
            type="text"
            autoComplete="off"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            {...register('apiKey', {
              required: 'This field is required.',
            })}
          />
          <ErrorMessage
            errors={errors}
            name="apiKey"
            render={({ message }) => (
              <p className="text-xs text-red-600">{message}</p>
            )}
          />
        </div>
        <div className="flex flex-col w-full md:w-full gap-1">
          <label className="text-sm text-dark dark:text-zinc-300 ">
            REACT COMPONENT NAME
          </label>
          <input
            className={`py-3 px-4 text-dark bg-slate-300 dark:text-light dark:bg-[#00000034] rounded-xl  ${
              !errors.apiKey &&
              'focus-visible:outline focus-visible:outline-[#FF4785]'
            } ${errors.apiKey && 'outline outline-1 outline-red-600'}`}
            type="text"
            autoComplete="off"
            placeholder="My Component"
            {...register('componentName', {
              required: 'This field is required.',
            })}
          />
          <ErrorMessage
            errors={errors}
            name="apiKey"
            render={({ message }) => (
              <p className="text-xs text-red-600">{message}</p>
            )}
          />
        </div>
        <div className="flex flex-col w-full h-full gap-1">
          <label className="text-sm text-dark dark:text-zinc-300">
            REACT COMPONENT
          </label>
          <textarea
            className={`h-full min-h-[400px] rounded-xl py-3 px-4 text-dark bg-slate-300 dark:text-light dark:bg-[#00000034] focus-visible:outline focus-visible:outline-[#FF4785] ${
              errors.component && 'outline outline-1 outline-red-600'
            }`}
            placeholder={`import React from 'react'\n\nconst MyComponent = () => {\n  render <></>\n}\n\nexport default MyComponent;`}
            {...register('component', {
              required: 'This field is required.',
            })}
            onClick={() => !hasClicked && setValue('story', undefined)}
          />
          <ErrorMessage
            errors={errors}
            name="component"
            render={({ message }) => (
              <p className="text-xs text-red-600">{message}</p>
            )}
          />
        </div>
        <button
          className="flex flex-row items-center justify-center gap-2 text-base font-semibold transition-all duration-300 hover:bg-[#da3f72] bg-[#FF4785] py-3 px-7 w-full rounded-full outline outline-[3px] outline-rose-500/30"
          type="submit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
          </svg>
          {!getValues('story') && hasClicked
            ? 'Generating story...'
            : 'Generate story'}
        </button>
      </div>
      <div className="w-0.5 bg-[#00000034]"></div>

      <div className="flex flex-col w-72 md:w-[450px] ">
        <div className="flex flex-col h-full gap-1">
          <label className="text-sm text-dark dark:text-zinc-300">
            STORYBOOK STORY
          </label>
          <textarea
            readOnly={true}
            onClick={() =>
              !!getValues('story') &&
              navigator.clipboard.writeText(getValues('story')!)
            }
            className="h-full min-h-[500px] py-3 px-4 rounded-xl text-dark bg-slate-300 dark:text-light dark:bg-[#00000034] focus-visible:outline focus-visible:outline-[#FF4785]"
            {...register('story', { required: false })}
          />
        </div>
      </div>
    </form>
  )
}

export default Form

type Prop = {
  form: FormType
  items: StoriesType[]
  setItems: React.Dispatch<React.SetStateAction<StoriesType[]>>
  setUpdateStoriesList: React.Dispatch<React.SetStateAction<boolean>>
}
