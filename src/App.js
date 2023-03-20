import logo from './logo.svg';
import './App.css';
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTask } from './graphql/mutations'
import { listTasks, ListTasks } from './graphql/queries'
import { useEffect, useState } from 'react';

import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {

  const [task, setTask] = useState({
    name:'',
    description:'',
  })
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    const loadTask = async () => {
      const result = await API.graphql(graphqlOperation(listTasks))
      setTasks(result.data.listTasks.items)
    }
    loadTask()
  }, [])

  const handleSubmit =  async (e) => {
    e.preventDefault()
    const result = await API.graphql(graphqlOperation(createTask, {input: task}))
  }

  return (
    <>
    <Heading level={1}>Hello {user.username}</Heading>
    <form onSubmit={handleSubmit}>
      <input 
        name='title' 
        placeholder='Title' 
        onChange={e => setTask({ ...task, name: e.target.value})}
        />
      <textarea
      name='description'
      placeholder='Description' 
      onChange={e => setTask({ ...task, description: e.target.value})}>
      </textarea>
      <button>Submit</button>
    </form>
    {JSON.stringify(tasks)}
    <Button onClick={signOut}>Sign out</Button>
   </>
  );
}

export default withAuthenticator(App);
