import Area from '@components/common/Area.js';
import Button from '@components/common/Button.js';
import { EmailField } from '@components/common/form/EmailField.js';
import { Form, useFormContext } from '@components/common/form/Form.js';
import { PasswordField } from '@components/common/form/PasswordField.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

const SubmitButton: React.FC<{ formId: string }> = ({ formId }) => {
  const {
    formState: { isSubmitting }
  } = useFormContext();
  return (
    <div className="form-submit-button flex justify-center mt-6 pt-4 border-t border-[#E8D3D7]">
      <Button
        title="SIGN IN"
        onAction={() => {
          (document.getElementById(formId) as HTMLFormElement).dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          );
        }}
        isLoading={isSubmitting}
      />
    </div>
  );
};

interface LoginFormProps {
  action: string;
  homeUrl: string;
  registerUrl: string;
  forgotPasswordUrl: string;
}

export default function LoginForm({
  action,
  homeUrl,
  registerUrl,
  forgotPasswordUrl
}: LoginFormProps) {
  const [error, setError] = React.useState(null);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-white px-4 py-12">
      <div className="login__form w-full max-w-md bg-white rounded-2xl px-6 py-8 shadow-xl border border-[#F0E3E6]">
        <div className="login__form__inner">
          <h1 className="text-center mb-2 text-[28px] font-semibold tracking-wide uppercase font-[Montserrat] text-[#79192A]">
            {_('Login')}
          </h1>
          <p className="text-center mb-6 text-sm text-gray-600">Chào mừng bạn quay lại</p>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
          <Form
            id="loginForm"
            action={action}
            method="POST"
            onSuccess={(response) => {
              if (!response.error) {
                window.location.href = homeUrl;
              } else {
                setError(response.error.message);
              }
            }}
            submitBtn={false}
          >
            <div className="space-y-4">
              <Area
              id="loginFormInner"
              coreComponents={[
                {
                  component: {
                    default: (
                      <EmailField
                        label="Email"
                        name="email"
                        placeholder="Email"
                        required
                        validation={{
                          required: _('Email is required')
                        }}
                      />
                    )
                  },
                  sortOrder: 10
                },
                {
                  component: {
                    default: (
                      <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Password"
                        required
                        validation={{
                          required: _('Password is required')
                        }}
                      />
                    )
                  },
                  sortOrder: 20
                },
                {
                  component: {
                    default: <SubmitButton formId="loginForm" />
                  },
                  sortOrder: 30
                }
              ]}
              />
            </div>
          </Form>
          <div className="text-center mt-4 gap-6 flex justify-center text-sm">
            <a className="text-[#79192A] hover:opacity-80" href={registerUrl}>
              {_('Create an account')}
            </a>
            <a className="text-gray-700 hover:text-gray-900" href={forgotPasswordUrl}>{_('Forgot your password?')}</a>
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
    action: url(routeId: "customerLoginJson")
    registerUrl: url(routeId: "register")
    forgotPasswordUrl: url(routeId: "resetPasswordPage")
  }
`;
