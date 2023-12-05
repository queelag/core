import { beforeEach, describe, expect, it } from 'vitest'
import { Status } from '../../src'

describe('Status', () => {
  let status: Status

  beforeEach(() => {
    status = new Status()
  })

  it('gets and sets', () => {
    expect(status.isIdle('op1')).toBeTruthy()
    status.idle('op1')
    expect(status.isIdle('op1')).toBeTruthy()
    status.pending('op1')
    expect(status.isPending('op1')).toBeTruthy()
    status.success('op1')
    expect(status.isSuccess('op1')).toBeTruthy()
    status.error('op1')
    expect(status.isError('op1')).toBeTruthy()
  })

  it('clears', () => {
    status.pending('op1')
    expect(status.isPending('op1')).toBeTruthy()
    status.clear()
    expect(status.isPending('op1')).toBeFalsy()
  })

  it('has working complex getters', () => {
    expect(status.isEveryIdle(['op1'], ['op2'])).toBeTruthy()
    status.pending('op1')
    status.pending('op2')
    expect(status.isEveryPending(['op1'], ['op2'])).toBeTruthy()
    status.success('op1')
    status.success('op2')
    expect(status.isEverySuccess(['op1'], ['op2'])).toBeTruthy()
    status.error('op1')
    status.error('op2')
    expect(status.isEveryError(['op1'], ['op2'])).toBeTruthy()
    status.success('op1')
    expect(status.isEveryError(['op1'], ['op2'])).toBeFalsy()

    status.clear()

    expect(status.areSomeIdle(['op1'], ['op2'])).toBeTruthy()
    status.pending('op1')
    expect(status.areSomeIdle(['op1'], ['op2'])).toBeTruthy()
    status.pending('op2')
    expect(status.areSomeIdle(['op1'], ['op2'])).toBeFalsy()
    expect(status.areSomePending(['op1'], ['op2'])).toBeTruthy()
    status.success('op1')
    expect(status.areSomeSuccess(['op1'], ['op2'])).toBeTruthy()
    status.error('op2')
    expect(status.areSomeError(['op1'], ['op2'])).toBeTruthy()
  })
})
