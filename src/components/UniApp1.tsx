import React, { useContext, useRef, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Autocomplete, Button, TextField } from '@mui/material'

import { UniAppContext } from './UniAppProvider'
import { Alert } from './Alert'
import './UniApp.css'

const backendUrl =
    location.hostname === 'localhost'
        ? 'http://universities.hipolabs.com/search?country=Czech+Republic&name='
        : 'https://combo.4dates.net/v1/uni-cz'

interface IUniAppFormInputs {
    name: string
    uni: string
}
const UniApp1 = () => {
    const { state, actions } = useContext(UniAppContext)
    const [uniChanged, setUniChanged] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            name: '',
            uni: '',
        },
    })
    const onSubmit: SubmitHandler<IUniAppFormInputs> = (formData) => {
        console.log('onSubmit(): form data:', formData, ', uni name:', formData.uni)
        actions.setInfo({ name: formData.name, uni: formData.uni })
        setValue('name', '')
        setValue('uni', '')
        setUniChanged(false)
    }
    const {
        isPending,
        error: loadError,
        data,
    } = useQuery({
        queryKey: ['uniData'],
        queryFn: () => axios.get(backendUrl).then((res) => res.data),
    })
    if (loadError) return 'University list loading error: ' + loadError.message
    const customOnChange = (event: React.SyntheticEvent, value: any, reason: string, details: any) => {
        // console.log('customOnChange(): reason:', reason, ', value: ', value)
        // console.log('customOnChange(): uni value:', getValues('uni'))
        setUniChanged(true)
    }

    return (
        <div className="UniAppContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: 'Name is required',
                        pattern: {
                            value: /^[a-zA-Z ]+$/,
                            message: 'Name can contain only letters',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Max name length is 50 chars',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            style={{ width: '100%' }}
                            variant="standard"
                            sx={{
                                '& .MuiInputBase-input': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                },
                            }}
                            placeholder="Name"
                            helperText={!!errors.name ? errors.name.message : ''}
                            autoFocus={true}
                            error={!!errors.name}
                            {...field}
                        />
                    )}
                />
                {isPending && <div>Loading...</div>}
                {!isPending && (
                    <Controller
                        name="uni"
                        control={control}
                        rules={{
                            required: 'University is required',
                            maxLength: {
                                value: 100,
                                message: 'Max length is 100 chars',
                            },
                        }}
                        render={({ field, fieldState, formState }) => {
                            // console.log('Controller(): render(): field: ', field, ', get value: ', getValues('uni'))
                            return (
                                <Autocomplete
                                    openOnFocus
                                    selectOnFocus
                                    handleHomeEndKeys
                                    value={uniChanged ? field.value : ''}
                                    onChange={customOnChange}
                                    onKeyDown={(e) => {
                                        setValue('uni', getValues('uni') + e.key)
                                        // console.log('onKeyDown(): e:', e.key, ', value:', getValues('uni'))
                                    }}
                                    options={data.map((option: any) => option.name)}
                                    isOptionEqualToValue={(option: any, value: any) => {
                                        return option === value
                                    }}
                                    getOptionLabel={(option: any) => {
                                        if (typeof option === 'string') {
                                            setValue('uni', option)
                                        }
                                        return option
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            variant="standard"
                                            {...params}
                                            label="University"
                                            helperText={!!errors.uni && errors.uni.message}
                                            error={!!errors.uni}
                                        />
                                    )}
                                />
                            )
                        }}
                    />
                )}
                <div className="UniAppSubmitButton">
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
            <Alert />
        </div>
    )
}

export default UniApp1
