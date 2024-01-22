<template>
    <div>
        <InputForm :fields="formItems" 
            :error-message="getErrorResetMessage"
            :on-focus="removeErrorMessage"
            :on-submit="sendResetEmail">
        </InputForm>
        <span v-if="getResetSent" style="color: green">Reset email sent successfully!</span>
    </div>
</template>

<script>
import InputForm from '@/components/InputForm';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'forgot-password',
  components: {
    InputForm
  },
  data() {
    return {
        formItems: [
          { type: 'text', id: 'email', text: 'Email', placeholder: 'enter reset email here' }
        ]
    }
  },
  methods: {
    ...mapMutations(['setErrorResetMessage']),
    ...mapActions(['sendResetPasswordEmail']),
    sendResetEmail(values) {
        if (!values[0]) {
          this.setErrorResetMessage({ value: 'Email is missing...' });
          return;
        }

        this.sendResetPasswordEmail({ email: values[0] });
    },
    removeErrorMessage() {
      this.setErrorResetMessage({ value: '' });
    }
  },
  computed: {
    ...mapGetters(['getErrorResetMessage', 'getResetSent'])
  }
}
</script>