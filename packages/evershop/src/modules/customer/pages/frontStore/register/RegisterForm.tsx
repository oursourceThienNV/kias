import Area from '@components/common/Area.js';
import { EmailField } from '@components/common/form/EmailField.js';
import { Form } from '@components/common/form/Form.js';
import { InputField } from '@components/common/form/InputField.js';
import { PasswordField } from '@components/common/form/PasswordField.js';
import Button from '@components/common/Button.js';
import { useCustomerDispatch } from '@components/frontStore/customer/customerContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
  homeUrl: string;
  loginUrl: string;
}
export default function RegisterForm({ homeUrl, loginUrl }: RegisterFormProps) {
  const { register } = useCustomerDispatch();
  const [error, setError] = React.useState(null);
  const form = useForm();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-white px-4 py-12">
      <div className="register__form w-full max-w-md bg-white rounded-2xl px-6 py-8 shadow-xl border border-[#F0E3E6]">
        <div className="register__form__inner">
          <h1 className="text-center mb-2 text-[28px] font-semibold tracking-wide uppercase font-[Montserrat] text-[#79192A]">
            {_('Create A New Account')}
          </h1>
          <p className="text-center mb-6 text-sm text-gray-600">Đăng ký để trải nghiệm mua sắm tốt hơn</p>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          <Form
            id="registerForm"
            form={form}
            method="POST"
            submitBtn={false}
            onSubmit={async (data) => {
              try {
                await register(
                  {
                    full_name: data.full_name,
                    email: data.email,
                    password: data.password
                  },
                  true,
                  homeUrl
                );
              } catch (error) {
                setError(error.message);
              }
            }}
            submitBtnText={_('SIGN UP')}
          >
            <div className="space-y-4">
              <Area
                id="customerRegisterForm"
                coreComponents={[
                  {
                    component: {
                      default: (
                        <InputField
                          name="full_name"
                          label={_('Full Name')}
                          placeholder={_('Full Name')}
                          required
                          validation={{ required: _('Full Name is required') }}
                        />
                      )
                    },
                    sortOrder: 10
                  },
                  {
                    component: {
                      default: (
                        <EmailField
                          name="email"
                          label={_('Email')}
                          placeholder={_('Email')}
                          required
                          validation={{ required: _('Email is required') }}
                        />
                      )
                    },
                    sortOrder: 20
                  },
                  {
                    component: {
                      default: (
                        <PasswordField
                          name="password"
                          label={_('Password')}
                          placeholder={_('Password')}
                          required
                          validation={{ required: _('Password is required') }}
                        />
                      )
                    },
                    sortOrder: 30
                  }
                ]}
              />
            
            {/* Centered submit button */}
            <div className="form-submit-button flex justify-center mt-6 pt-4 border-t border-[#E8D3D7]">
              <Button title={_('SIGN UP')} type="submit" />
            </div>
            </div>
          </Form>
          <div className="text-center mt-4 gap-6 flex justify-center text-sm">
            <span className="text-gray-700">{_('Already have an account?')}</span>
            <a className="text-[#79192A] hover:opacity-80" href={loginUrl}>{_('Login')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    homeUrl: url(routeId: "homepage")
    loginUrl: url(routeId: "login")
  }
`;
