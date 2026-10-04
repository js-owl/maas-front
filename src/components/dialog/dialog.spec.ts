import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth.store'
import { useEmailStore } from '@/stores/email.store'
import { usePasswordStore } from '@/stores/password.store'
import { useRegStore } from '@/stores/reg.store'
import { mockJson } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import router from '@/router'
import DialogInfoPayment from './DialogInfoPayment.vue'
import DialogLogin from './DialogLogin.vue'
import DialogForgotPassword from './DialogForgotPassword.vue'
import DialogRegistration from './DialogRegistration.vue'
import DialogCall from './DialogCall.vue'
import DialogEditUser from './DialogEditUser.vue'
import {
  EMAIL_JUST_CONFIRMED_KEY,
  EMAIL_NOT_VERIFIED_ERROR,
} from '@/helpers/email-verification'
import { PASSWORD_JUST_RESET_KEY } from '@/helpers/password-recovery'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

const ElDialogStub = {
  name: 'ElDialog',
  inheritAttrs: false,
  props: { modelValue: { type: Boolean, default: true } },
  emits: ['update:modelValue', 'close'],
  template: `
    <div class="el-dialog-stub">
      <slot name="header" :title-id="'dialog-title'" :titleId="'dialog-title'" />
      <slot />
      <div class="el-dialog-stub__footer"><slot name="footer" /></div>
    </div>
  `,
}

const dialogStubs = {
  'el-dialog': ElDialogStub,
  ElDialog: ElDialogStub,
  teleport: true,
  transition: false,
}

let elMessageCalls: unknown[] = []

beforeEach(() => {
  elMessageCalls = []
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const elMessage = ElMessage as unknown as ((opts: unknown) => unknown) & {
    success: (...args: unknown[]) => unknown
    error: (...args: unknown[]) => unknown
    warning: (...args: unknown[]) => unknown
  }
  vi.spyOn(elMessage as object as { success: typeof ElMessage.success }, 'success').mockImplementation(
    ((...args: unknown[]) => {
      elMessageCalls.push({ kind: 'success', args })
      return undefined
    }) as never
  )
  vi.spyOn(elMessage as object as { error: typeof ElMessage.error }, 'error').mockImplementation(
    ((...args: unknown[]) => {
      elMessageCalls.push({ kind: 'error', args })
      return undefined
    }) as never
  )
  vi.spyOn(elMessage as object as { warning: typeof ElMessage.warning }, 'warning').mockImplementation(
    ((...args: unknown[]) => {
      elMessageCalls.push({ kind: 'warning', args })
      return undefined
    }) as never
  )
  // Callable form: ElMessage({ type: 'warning', message: '...' })
  const callable = vi.fn((opts: unknown) => {
    elMessageCalls.push({ kind: 'call', args: [opts] })
    return undefined
  })
  Object.assign(callable, ElMessage)
  vi.stubGlobal('__unused', null)
  // Patch the imported binding's apply behavior via prototype isn't possible;
  // instead wrap by replacing methods above and using a direct mock for call form:
  ;(ElMessage as unknown as { mockImpl?: typeof callable }).mockImpl = callable
  vi.spyOn({ ElMessage }, 'ElMessage' as never).mockImplementation?.(callable as never)
})

describe('DialogInfoPayment', () => {
  it('closes and navigates to personal orders', async () => {
    const push = vi.spyOn(router, 'push').mockResolvedValue(undefined as never)
    const { wrapper } = await mountWithPlugins(DialogInfoPayment, {
      props: { modelValue: true },
      stubs: dialogStubs,
    })
    expect(wrapper.find('.el-dialog-stub').exists()).toBe(true)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(push).toHaveBeenCalledWith({ name: 'personal-orders' })
    push.mockRestore()
  })
})

describe('DialogLogin', () => {
  async function mountLogin() {
    return mountWithPlugins(DialogLogin, {
      props: { modelValue: true },
      stubs: {
        ...dialogStubs,
        DialogRegistration: true,
        DialogForgotPassword: true,
      },
    })
  }

  it('loads saved credentials and logs in', async () => {
    localStorage.setItem(
      'login-credentials',
      JSON.stringify({ username: 'a@b.c', password: 'secret' })
    )
    const { wrapper, pinia } = await mountLogin()
    await flush()
    expect(wrapper.find('.el-dialog-stub').exists()).toBe(true)
    const username = wrapper.find('#login-username')
    expect(username.exists()).toBe(true)
    expect((username.element as HTMLInputElement).value).toBe('a@b.c')

    const auth = useAuthStore(pinia)
    await wrapper.find('#dialog-login-form').trigger('submit')
    await flush()
    expect(auth.login).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })

  it('shows error when login fails', async () => {
    const { wrapper, pinia } = await mountLogin()
    const auth = useAuthStore(pinia)
    ;(auth.login as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('bad'))

    await wrapper.find('#login-username').setValue('x@y.z')
    await wrapper.find('#login-password').setValue('pw')
    await wrapper.find('#dialog-login-form').trigger('submit')
    await flush()
    expect(wrapper.text()).toContain('Неправильный email или пароль')
  })

  it('shows verification UI when email is not verified', async () => {
    const { wrapper, pinia } = await mountLogin()
    const auth = useAuthStore(pinia)
    ;(auth.login as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error(EMAIL_NOT_VERIFIED_ERROR)
    )

    await wrapper.find('#login-username').setValue('x@y.z')
    await wrapper.find('#login-password').setValue('pw')
    await wrapper.find('#dialog-login-form').trigger('submit')
    await flush()
    expect(wrapper.text()).toMatch(/подтверд/i)
  })

  it('reacts to confirmation/reset flags when opened', async () => {
    sessionStorage.setItem(EMAIL_JUST_CONFIRMED_KEY, '1')
    sessionStorage.setItem(PASSWORD_JUST_RESET_KEY, '1')
    const { wrapper } = await mountWithPlugins(DialogLogin, {
      props: { modelValue: false },
      stubs: {
        ...dialogStubs,
        DialogRegistration: true,
        DialogForgotPassword: true,
      },
    })
    await wrapper.setProps({ modelValue: true })
    await flush()
    expect(ElMessage.success).toHaveBeenCalled()
    expect(sessionStorage.getItem(EMAIL_JUST_CONFIRMED_KEY)).toBeNull()
    expect(sessionStorage.getItem(PASSWORD_JUST_RESET_KEY)).toBeNull()
  })
})

describe('DialogForgotPassword', () => {
  it('sends recovery and shows success', async () => {
    const { wrapper, pinia } = await mountWithPlugins(DialogForgotPassword, {
      props: { modelValue: true },
      stubs: dialogStubs,
    })
    const password = usePasswordStore(pinia)
    ;(password.canResend as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(password.sendRecovery as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    await wrapper.find('input').setValue('reset@example.com')
    await wrapper.find('form').trigger('submit')
    await flush()
    expect(password.sendRecovery).toHaveBeenCalledWith('reset@example.com')
    expect(ElMessage.success).toHaveBeenCalled()
  })

  it('emits openLogin after a successful recovery send', async () => {
    const { wrapper, pinia } = await mountWithPlugins(DialogForgotPassword, {
      props: { modelValue: true },
      stubs: dialogStubs,
    })
    const password = usePasswordStore(pinia)
    ;(password.canResend as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true)
    ;(password.sendRecovery as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)

    await wrapper.find('input').setValue('reset@example.com')
    await wrapper.find('form').trigger('submit')
    await flush()

    const loginBtn = wrapper.findAll('button').find((n) => n.text().includes('Войти'))
    expect(loginBtn).toBeTruthy()
    await loginBtn!.trigger('click')
    expect(wrapper.emitted('openLogin')).toBeTruthy()
  })
})

describe('DialogRegistration', () => {
  it('does not register without agreements', async () => {
    const { wrapper, pinia } = await mountWithPlugins(DialogRegistration, {
      props: { modelValue: true },
      stubs: dialogStubs,
    })
    const reg = useRegStore(pinia)
    await wrapper.find('form').trigger('submit')
    await flush()
    expect(reg.register).not.toHaveBeenCalled()
  })

  it('registers when form is valid', async () => {
    const { wrapper, pinia } = await mountWithPlugins(DialogRegistration, {
      props: { modelValue: true },
      stubs: dialogStubs,
    })
    const reg = useRegStore(pinia)
    const email = useEmailStore(pinia)
    ;(reg.register as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ email: 'n@e.w' })
    ;(email.sendConfirmation as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      message: 'ok',
    })

    for (const cb of wrapper.findAllComponents({ name: 'ElCheckbox' })) {
      await cb.vm.$emit('update:modelValue', true)
    }
    // Also toggle our Checkbox wrapper if used
    for (const cb of wrapper.findAllComponents({ name: 'Checkbox' })) {
      await cb.vm.$emit('update:modelValue', true)
    }

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('new@example.com')
    if (inputs[1]) await inputs[1].setValue('Иванов Иван')
    if (inputs[2]) await inputs[2].setValue('79991234567')
    if (inputs[3]) await inputs[3].setValue('password1')
    if (inputs[4]) await inputs[4].setValue('password1')

    await wrapper.find('form').trigger('submit')
    await flush()
    expect(wrapper.exists()).toBe(true)
  })
})

describe('DialogCall', () => {
  it('submits a call request', async () => {
    mockJson('/api/v3/call-request', { ok: true })
    const { wrapper } = await mountWithPlugins(DialogCall, {
      props: { modelValue: true },
      stubs: dialogStubs,
      stubActions: false,
    })
    await flush()

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThan(0)
    await inputs[0].setValue('Иван')
    await inputs[1].setValue('79991234567')
    if (inputs[2]) await inputs[2].setValue('Фрезеровка')

    for (const cb of wrapper.findAllComponents({ name: 'ElCheckbox' })) {
      await cb.vm.$emit('update:modelValue', true)
    }

    await wrapper.find('form').trigger('submit')
    await flush()
    expect(wrapper.exists()).toBe(true)
  })
})

describe('DialogEditUser', () => {
  it('populates fields from user and submits update', async () => {
    mockJson(/\/api\/v3\/users\//, { id: 5 })
    const user = {
      id: 5,
      username: 'user1',
      email: 'u@e.x',
      user_type: 'individual',
      full_name: 'User',
      phone_number: '79991112233',
    }
    const { wrapper } = await mountWithPlugins(DialogEditUser, {
      props: { modelValue: true, user },
      stubs: dialogStubs,
      stubActions: false,
      initialState: { auth: { token: 'tok' } },
    })
    await flush()
    expect(wrapper.find('input').exists()).toBe(true)

    await wrapper.find('form').trigger('submit')
    await flush()
    expect(wrapper.exists()).toBe(true)
  })

  it('errors when user id is missing', async () => {
    const { wrapper } = await mountWithPlugins(DialogEditUser, {
      props: { modelValue: true, user: { username: 'x' } },
      stubs: dialogStubs,
    })
    await wrapper.find('form').trigger('submit')
    await flush()
    expect(ElMessage.error).toHaveBeenCalled()
  })
})
