import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { minValue } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm, SimpleFormProps } from '../form';
import { DateInput, DateInputProps } from './DateInput';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/DateInput' };

export const Basic = ({
    dateInputProps,
    simpleFormProps,
}: {
    dateInputProps?: Partial<DateInputProps>;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateInput source="publishedAt" {...dateInputProps} />
    </Wrapper>
);

export const OnChangeValidation = ({
    dateInputProps = {
        validate: value => {
            console.log({ value });
            return undefined;
        },
    },
    simpleFormProps = { mode: 'onChange' },
}: {
    dateInputProps?: Partial<DateInputProps>;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateInput source="publishedAt" {...dateInputProps} />
    </Wrapper>
);

export const NonFullWidth = () => (
    <Wrapper>
        <DateInput source="publishedAt" fullWidth={false} />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        All the displayed values should be the same: 2021-09-11 displayed in the
        browser locale
        {[
            '2021-09-11',
            '09/11/2021', // US date format
            '2021-09-11T20:46:20.000+02:00',
            '2021-09-11 20:46:20.000+02:00',
            '2021-09-11T20:46:20.000-04:00',
            '2021-09-11 20:46:20.000-04:00',
            '2021-09-11T20:46:20.000Z',
            '2021-09-11 20:46:20.000Z',
            new Date('2021-09-11T20:46:20.000+02:00'),
            // although this one is 2021-09-10, its local timezone makes it 2021-09-11 in the test timezone
            new Date('2021-09-10T20:46:20.000-04:00'),
            new Date('2021-09-11T20:46:20.000Z'),
            1631385980000,
        ].map((defaultValue, index) => (
            <DateInput
                key={index}
                source={`publishedAt-${index}`}
                defaultValue={defaultValue}
                helperText={false}
            />
        ))}
    </Wrapper>
);
export const Disabled = () => (
    <Wrapper>
        <DateInput source="publishedAt" disabled />
        <DateInput source="announcement" defaultValue="01/01/2000" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateInput source="publishedAt" readOnly />
        <DateInput source="announcement" defaultValue="01/01/2000" readOnly />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <DateInput source="publishedAt" validate={minValue('2022-10-26')} />
    </Wrapper>
);

export const Parse = ({ simpleFormProps }) => (
    <Wrapper simpleFormProps={simpleFormProps}>
        <DateInput source="publishedAt" parse={value => new Date(value)} />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({
    children,
    simpleFormProps,
}: {
    children: React.ReactNode;
    simpleFormProps?: Partial<SimpleFormProps>;
}) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create resource="posts">
            <SimpleForm {...simpleFormProps}>
                {children}
                <FormInspector name="publishedAt" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
