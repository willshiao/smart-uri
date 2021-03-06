<template>
  <div class="container">
    <h3>Redirect Form</h3>

    <br>

    <b-form @submit="onSubmit">
      <h5>Redirect Name</h5>
      <b-form-input v-model="form.name" type="text" maxlength="150" placeholder="Redirect name"></b-form-input>
      <p></p>

      <h5>Rules</h5>
      <div id="rules-container">
        <div class="rule" v-for="(rule, index) in form.rules" :key="index">
          <h6>Rule name</h6>
          <b-form-input v-model="rule.name" type="text" placeholder="Rule name" maxlength="150"></b-form-input>

          <h6>Rule Type</h6>
          <b-form-select v-model="rule.type" v-on:input="updateType($event, index)" type="text" :options="ruleOptions"></b-form-select>

          <h6 v-if="rule.type == 'jsonLogic'">Rule JSON</h6>
          <b-form-textarea v-if="rule.type == 'jsonLogic'" v-model="rule.info.statementStr" placeholder="JSON Logic Rule here" :rows="3"></b-form-textarea>

          <div v-if="rule.type == 'jsonLogic'">
            <h6>Rule Target</h6>
            <b-form-input v-model="rule.target" type="text" placeholder="http://example.com"></b-form-input>
            <b-form-text>The URL the user will be redirected to if the rule matches</b-form-text>

            <div><b-form-checkbox v-model="rule.info.returnsUrl">JSON Logic Rule returns URL</b-form-checkbox></div>
          </div>

          <div v-if="rule.type == 'roundRobin'">
            <h6>Round Robin Targets</h6>
            <b-form-input v-model="rule.info.targetsStr" type="text" placeholder="Targets"></b-form-input>
            <b-form-text>Enter a comma-seperated list of targets to distribute requests over.</b-form-text>
          </div>

          <b-button variant="danger" class="deleteRuleBtn" v-on:click="deleteRule(index)">Delete Rule</b-button>
        </div>
        <b-button variant="primary" v-on:click="addRule" class="addRuleBtn">Add Rule</b-button>
      </div>

      <h5>Default Target</h5>
      <b-form-input v-model="form.defaultTarget" type="text" placeholder="Default Target URL"></b-form-input>
      <b-form-text>This will the be the URL used if no rules match.</b-form-text>
      <p></p>

      <div v-if="user.role >= 10">
        <h5>Slug</h5>
        <b-form-input v-model="form.slug" type="text" placeholder="Slug"></b-form-input>
        <b-form-text>Will be randomly assigned if left empty.</b-form-text>
        <p></p>
      </div>

      <div>
        <b-form-checkbox id="enabledBox" v-model="form.enabled">Enable</b-form-checkbox>
      </div>
      <div>
        <b-form-checkbox id="extraInfoBox" v-model="form.extraInfo">Collect additional request information</b-form-checkbox>
      </div>

      <div id="submitDiv">
        <b-button variant="primary" type="submit" v-bind:class="{ disabled: submitPending }">Create Redirect</b-button>  
      </div>

    </b-form>
  </div>
</template>

<script>
import Vue from 'vue';
import api from '@/lib/api';
import store from '@/store';

export default {
  name: 'redirect-form',
  data() {
    return {
      user: store.getters.user,
      form: {
        rules: [],
        enabled: true,
        extraInfo: true,
      },
      ruleOptions: {
        jsonLogic: 'JSON Logic',
        roundRobin: 'Round Robin',
      },
      submitPending: false,
    };
  },
  methods: {
    addRule() {
      this.form.rules.push({ info: { returnsUrl: false } });
    },
    deleteRule(index) {
      this.form.rules.splice(index, 1);
    },
    updateType(evt, index) {
      const newVal = this.form.rules[index];
      newVal.type = evt;
      Vue.set(this.form.rules, index, newVal);
    },
    onSubmit(evt) {
      evt.preventDefault();

      const form = this.form;
      for(let i = 0; i < form.rules.length; i++) {
        const rule = form.rules[i];
        if(rule.type === 'jsonLogic') {
          rule.info.statement = JSON.parse(rule.info.statementStr);
        } else if(rule.type === 'roundRobin') {
          rule.info.targets = rule.info.targetsStr.split(',').map(t => t.trim());
        } else {
          this.$swal({ type: 'warning', title: 'Error processing rule', text: `Error processing rule (name: ${rule.name}).` });
          return;
        }
      }
      this.submitPending = true;
      api.request('api/redirects', {
        method: 'POST',
        data: form,
      }).then((res) => {
        this.submitPending = false;
        if(res.data.status === 'success') {
          const slug = res.data.data.slug;
          this.$swal({
            type: 'success',
            title: 'Success',
            html: `New redirect successfully created with slug: ${slug}. Available at <a href="${api.baseUrl}/${slug}">${api.baseUrl}/${slug}</a>` });
          return;
        }
        this.$swal({ type: 'warning', title: 'Failed to create redirect', text: res.data.message });
      }).catch(() => {
        this.$swal({ type: 'error', title: 'Failed to connect to API server', text: 'Check your internet and try logging out and back in again.' });
        this.submitPending = false;
      });
    },
  },
};
</script>

<style scoped>
.deleteRuleBtn {
  margin-top: 10px;
}

div#rules-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.addRuleBtn {
  margin-left: 2em;
}

#submitDiv {
  margin-top: 25px;
}

div.rule {
  margin-left: 2em;
  padding: 10px 10px 10px 10px;
  outline: black solid thin;
  margin-bottom: 15px;
}
</style>
